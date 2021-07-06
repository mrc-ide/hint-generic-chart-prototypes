import {MutationTree} from "vuex";
import {GenericChartsState} from "@/store/genericCharts/state";
import {getChartFromSelections} from "@/store/genericCharts/utils";
import {ChartConfigPayload, DataSourceFilterOptionsPayload, DataSourcePayload} from "@/types";

export const mutations: MutationTree<GenericChartsState> = {
    setDataSource(state: GenericChartsState, payload: DataSourcePayload) {
        const chart = getChartFromSelections(state.selections, payload.step, payload.tabId, payload.chartIndex);
        chart.dataSources[payload.dataSourceId].datasetId = payload.newValue;
        chart.dataSources[payload.dataSourceId].indicatorId = undefined; // new dataset (probably invalidates indicator)
    },
    setIndicator(state: GenericChartsState, payload: DataSourcePayload) {
        const chart = getChartFromSelections(state.selections, payload.step, payload.tabId, payload.chartIndex);
        chart.dataSources[payload.dataSourceId].indicatorId = payload.newValue;
    },
    setSelectedFilterOptions(state: GenericChartsState, payload: DataSourceFilterOptionsPayload) {
        const chart = getChartFromSelections(state.selections, payload.step, payload.tabId, payload.chartIndex);
        chart.dataSources[payload.dataSourceId].selectedFilterOptions = payload.newValue;
    },
    setChartConfigId(state: GenericChartsState, payload: ChartConfigPayload) {
        const chart = getChartFromSelections(state.selections, payload.step, payload.tabId, payload.chartIndex);
        chart.chartConfigId = payload.chartConfigId;
    }
};
