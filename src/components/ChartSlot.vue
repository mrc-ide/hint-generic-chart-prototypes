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
                <div class="form-group">
                    <label class="font-weight-bold" for="chart-style">Style</label>
                    <select v-if="chart.chartConfigOptions.length > 0"
                            id="chart-style"
                            class="form-control"
                            @change="updateChartConfigId(chartIndex, $event)"
                    >
                        <option v-for="chartConfig in chart.chartConfigOptions"
                                :value="chartConfig.id">
                            {{chartConfig.label}}
                        </option>
                    </select>
                </div>
            </div>
            <div class="col-9">
                <div class="chart-container" :style="{height: chartHeight}">
                    <chart class="chart"
                           :chart-metadata="chart.config"
                           :chart-data="chart.chartData.data"
                           :layout-data="chart.layoutData"
                           :style="{height: chart.scrollHeight}"></chart>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {mapGetters, mapMutations, mapState} from "vuex";
    import {
        ChartConfigPayload,
        ChartData, DatasetConfig,
        DataSourceConfig, DataSourceFilterOptionsPayload,
        DataSourcePayload, DataSourceSelections, Filter, FilterOption,
        GenericChartsConfig,
        GenericChartsSelections, IndicatorOption,
        SlotConfig
    } from "@/types";
    import DataSource from "./dataSelectors/DataSource.vue";
    import Indicator from "./dataSelectors/Indicator.vue";
    import Filters from "./dataSelectors/Filters.vue";
    import Chart from "./Chart.vue";
    import {expandDatasetFilters, getChartFromSelections} from "@/store/genericCharts/utils";

    const namespace = "genericCharts";

    interface ChartValues {
        chartData: Record<string, any>
        layoutData: Record<string, any>
        dataSourceValues: DataSourceValues[]
        datasets: DatasetConfig[]
        config: string
        scrollHeight: string
        chartConfigOptions: {
            id: string,
            label: string,
            config: string
        }[]
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
        tabId: string,
        chartHeight: string
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
        setChartConfigId: (payload: ChartConfigPayload) => void
        updateDataSource: (chartIndex: number, dataSourceId: string, newValue: string) => void,
        updateIndicator: (chartIndex: number, dataSourceId: string, newValue: string) => void
        updateSelectedFilterOptions: (chartIndex: number, dataSourceId: string, newValue: Record<string, FilterOption[]>) => void
        updateChartConfigId: (chartIndex: number, event: Event) => void
    }

    export default Vue.extend<{}, Methods, Computed, Props>( {
        name: "ChartSlot",
        props: {
            step: {type: Number},
            tabId: {type: String},
            chartHeight: {type: String}
        },
        components: {
            DataSource,
            Indicator,
            Filters,
            Chart
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

                    const chartConfig = chartSelections.chartConfigId ? c.chartConfig.find(c => c.id === chartSelections.chartConfigId)!
                                                                      : c.chartConfig[0];

                    //Sort out layout issues around subplots - provide additional metadata to jsonata (rows and columns)
                    //and define scroll height
                    const layoutData = {} as any;
                    let scrollHeight = "100*"
                    if (c.subplots) {
                        const numberOfPlots = [...new Set(chartData.data.data.map((row: any) => row[c.subplots!!.distinctColumn]))].length;
                        const rows = Math.ceil(numberOfPlots / c.subplots.columns);

                        layoutData.subplots = {
                            ...c.subplots,
                            rows
                        }

                        scrollHeight = `${c.subplots.heightPerRow * rows}px`;
                    }

                    return {
                        chartData,
                        layoutData,
                        dataSourceValues,
                        datasets: c.datasets,
                        config: chartConfig.config,
                        scrollHeight,
                        chartConfigOptions: c.chartConfig
                    }
                });
            }
        },
        methods: {
            ...mapMutations(namespace, ["setDataSource", "setIndicator", "setSelectedFilterOptions", "setChartConfigId"]),
            updateDataSource(chartIndex, dataSourceId: string, newValue: string) {
                this.setDataSource({step: this.step, tabId: this.tabId, chartIndex, dataSourceId, newValue});
            },
            updateIndicator(chartIndex: number, dataSourceId: string, newValue: string) {
                this.setIndicator({step: this.step, tabId: this.tabId, chartIndex, dataSourceId, newValue});
            },
            updateSelectedFilterOptions(chartIndex: number, dataSourceId: string, newValue: Record<string, FilterOption[]>) {
                this.setSelectedFilterOptions({step: this.step, tabId: this.tabId, chartIndex, dataSourceId, newValue});
            },
            updateChartConfigId(chartIndex: number, event: Event) {
                const newValue = (event.target as HTMLSelectElement).value;
                this.setChartConfigId({step: this.step, tabId: this.tabId, chartIndex, chartConfigId: newValue});
            }
        }
    })
</script>

<style lang="scss">
    .chart-container {
        overflow-y: scroll;
        width: 100%;
    }

    .chart {
        width: 100%;
    }

    .annotation-text {
        font-weight: bold;
    }

    .ytick text{
        fill: #777;
    }

    .xtick text{
        fill: #777;
    }
</style>
