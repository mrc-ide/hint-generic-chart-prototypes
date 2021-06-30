<template>
    <div>
        Charts prototype
        <div v-for="(chart, chartIndex) in charts">
            {{JSON.stringify(chart.editableDataSources)}}
            {{JSON.stringify(chart.chartData)}}
            <data-source v-for="ds in chart.editableDataSources"
                :config="ds"
                value="dataSourceValues[ds.id]"
                @update="updateDataSource(chartIndex, ds.id, $event)"
            ></data-source>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {mapGetters, mapMutations, mapState} from "vuex";
    import {
        ChartConfig,
        DataSourceConfig,
        DataSourcePayload,
        GenericChartsConfig,
        GenericChartsSelections,
        SlotConfig
    } from "@/types";
    import DataSource from "./dataSelectors/DataSource.vue";
    import {getChartFromSelections} from "@/store/genericCharts/utils";

    const namespace = "genericCharts";

    interface ChartValues {
        editableDataSources: DataSourceConfig[]
        chartData: Record<string, any>
        dataSourceValues: Record<string, string>
    }

    interface Props {
        step: number,
        tabId: string
    }

    interface Computed {
        config: GenericChartsConfig,
        selections: GenericChartsSelections,
        chartData: (chartConfig: ChartConfig) => Record<string, any>
        slotConfig: SlotConfig,
        charts: ChartValues[]
    }

    interface Methods {
        setDataSource: (payload: DataSourcePayload) => void,
        updateDataSource: (chartIndex: number, dataSourceId: string, newValue: string) => void
    }

    export default Vue.extend<{}, Methods, Computed, Props>( {
        name: "ChartSlot",
        props: {
            step: {type: Number},
            tabId: {type: String}
        },
        components: {
            DataSource
        },
        computed: {
            ...mapState(namespace, ["config", "selections"]),
            ...mapGetters(namespace, ["chartData"]),
            slotConfig() {
                return this.config.slots.find(s => s.stepNumber === this.step && s.tabId === this.tabId)!;
            },
            charts() {
                return this.slotConfig.charts.map((c, idx) => {
                    const editableDataSources = c.dataSelectors.dataSources.filter(d => d.type === "editable");
                    const chartSelections = getChartFromSelections(this.selections, this.step, this.tabId, idx);
                    const dataSourceValues = chartSelections.dataSources;
                    return {
                        chartData: this.chartData(c),
                        editableDataSources,
                        dataSourceValues
                    }
                });
            }
        },
        methods: {
            ...mapMutations(namespace, ["setDataSource"]),
            updateDataSource(chartIndex, dataSourceId: string, newValue: string) {
                this.setDataSource({step: this.step, tabId: this.tabId, chartIndex, dataSourceId, newValue});
            }
        }
    })
</script>

<style scoped>

</style>
