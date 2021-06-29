<template>
    <div>
        Charts prototype
        <div v-for="chart in charts">
            {{JSON.stringify(chart.editableDataSources)}}
            {{JSON.stringify(chart.chartData)}}
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {mapGetters, mapState} from "vuex";
    import {ChartConfig, DataSourceConfig, GenericChartsConfig, GenericChartsSelections, SlotConfig} from "@/types";

    const namespace = "genericCharts";

    interface ChartValues {
        editableDataSources: DataSourceConfig[]
        chartData: Record<string, any>
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

    export default Vue.extend<{}, {}, Computed, Props>( {
        name: "ChartSlot",
        props: {
            step: {type: Number},
            tabId: {type: String}
        },
        computed: {
            ...mapState(namespace, ["config", "selections"]),
            ...mapGetters(namespace, ["chartData"]),
            slotConfig() {
                return this.config.slots.find(s => s.stepNumber === this.step && s.tabId === this.tabId)!;
            },
            charts() {
                return this.slotConfig.charts.map(c => {
                    const editableDataSources = c.dataSelectors.dataSources.filter(d => d.type === "editable");
                    return {
                        chartData: this.chartData(c),
                        editableDataSources
                    }
                });
            }
        }
    })
</script>

<style scoped>

</style>
