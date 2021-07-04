<template>
    <div>
        <div v-for="(chart, chartIndex) in charts" class="row">
            <div class="col-3">
                <div v-for="ds in chart.dataSourceValues">
                    <data-source v-if="ds.editable"
                                 :config="ds.config"
                                 :datasets="chart.datasets"
                                 :value="ds.selections.datasetId"
                                 @update="updateDataSource(chartIndex, ds.dataSourceId, $event)"
                    ></data-source>
                    <indicator v-if="ds.indicators.length > 0"
                               :indicators="ds.indicators"
                               :value="ds.selections.indicatorId"
                               @update="updateIndicator(chartIndex, ds.dataSourceId, $event)"
                    ></indicator>
                    <filters v-if="ds.expandedFilters.length > 0"
                             :filters="ds.expandedFilters"
                             :selected-filter-options="ds.selections.selectedFilterOptions || {}"
                             @update="updateSelectedFilterOptions(chartIndex, ds.dataSourceId, $event)"
                    ></filters>
                </div>
            </div>
            <div class="col-9">
                {{JSON.stringify(chart.chartData)}}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {mapGetters, mapMutations, mapState} from "vuex";
    import {
        ChartConfig, ChartData, ChartSelections, DatasetConfig,
        DataSourceConfig, DataSourceFilterOptionsPayload,
        DataSourcePayload, DataSourceSelections, Filter, FilterOption,
        GenericChartsConfig,
        GenericChartsSelections, IndicatorOption,
        SlotConfig
    } from "@/types";
    import DataSource from "./dataSelectors/DataSource.vue";
    import Indicator from "./dataSelectors/Indicator.vue";
    import Filters from "./dataSelectors/Filters.vue";
    import {expandDatasetFilters, getChartFromSelections} from "@/store/genericCharts/utils";

    const namespace = "genericCharts";

    interface ChartValues {
        chartData: Record<string, any>
        dataSourceValues: DataSourceValues[]
        datasets: DatasetConfig[]
    }

    interface DataSourceValues {
        dataSourceId: string,
        editable: boolean,
        config: DataSourceConfig,
        selections: DataSourceSelections,
        indicators: IndicatorOption[],
        expandedFilters: Filter[]
    }

    interface Props {
        step: number,
        tabId: string
    }

    interface Computed {
        expandedConfig: GenericChartsConfig,
        selections: GenericChartsSelections,
        chartData: ChartData,
        slotChartData: Record<string, any>[]
        slotConfig: SlotConfig,
        charts: ChartValues[]
    }

    interface Methods {
        setDataSource: (payload: DataSourcePayload) => void,
        setIndicator: (payload: DataSourcePayload) => void,
        setSelectedFilterOptions: (payload: DataSourceFilterOptionsPayload) => void
        updateDataSource: (chartIndex: number, dataSourceId: string, newValue: string) => void,
        updateIndicator: (chartIndex: number, dataSourceId: string, newValue: string) => void
        updateSelectedFilterOptions: (chartIndex: number, dataSourceId: string, newValue: Record<string, FilterOption[]>) => void
    }

    export default Vue.extend<{}, Methods, Computed, Props>( {
        name: "ChartSlot",
        props: {
            step: {type: Number},
            tabId: {type: String}
        },
        components: {
            DataSource,
            Indicator,
            Filters
        },
        computed: {
            ...mapState(namespace, ["selections"]),
            ...mapGetters(namespace, ["chartData", "expandedConfig"]),
            slotConfig() {
                return this.expandedConfig.slots.find(s => s.stepNumber === this.step && s.tabId === this.tabId)!;
            },
            slotChartData() {
                return this.chartData.slots.find(s => s.stepNumber === this.step && s.tabId === this.tabId)!.charts;
            },
            charts() {
                return this.slotConfig.charts.map((c, idx) => {
                    const chartSelections = getChartFromSelections(this.selections, this.step, this.tabId, idx);
                    const chartData = this.slotChartData[idx];
                    const dataSourceValues: DataSourceValues[] = [];

                    c.dataSelectors.dataSources.forEach((ds: DataSourceConfig) => {
                        let indicators: IndicatorOption[] = [];
                        if (ds.showIndicators) {
                            // For the sample data, indicators is defined in the filters section - may not always be the case
                            indicators = (chartData[ds.id] as any).filters.indicators;
                        }

                        const selections = chartSelections.dataSources[ds.id];
                        const datasetId = selections.datasetId;
                        const datasetConfig  = this.slotConfig.charts[idx].datasets.find(dsc => dsc.id === datasetId)!;
                        const expandedFilters = datasetConfig.filters || [];

                        dataSourceValues.push({
                            dataSourceId: ds.id,
                            selections,
                            editable: ds.type === "editable",
                            config: ds,
                            indicators,
                            expandedFilters
                        });
                    });
                    console.log("Data sources values: " + JSON.stringify(dataSourceValues));
                    return {
                        chartData,
                        dataSourceValues,
                        datasets: c.datasets
                    }
                });
            }
        },
        methods: {
            ...mapMutations(namespace, ["setDataSource", "setIndicator", "setSelectedFilterOptions"]),
            updateDataSource(chartIndex, dataSourceId: string, newValue: string) {
                this.setDataSource({step: this.step, tabId: this.tabId, chartIndex, dataSourceId, newValue});
            },
            updateIndicator(chartIndex: number, dataSourceId: string, newValue: string) {
                console.log("updatig ind in ChartSlot")
                this.setIndicator({step: this.step, tabId: this.tabId, chartIndex, dataSourceId, newValue});
            },
            updateSelectedFilterOptions(chartIndex: number, dataSourceId: string, newValue: Record<string, FilterOption[]>) {
                this.setSelectedFilterOptions({step: this.step, tabId: this.tabId, chartIndex, dataSourceId, newValue});
            }
        }
    })
</script>

<style scoped>

</style>
