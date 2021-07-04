import {MutationTree} from "vuex";
import {GenericChartsState} from "@/store/genericCharts/state";
import {getChartFromSelections} from "@/store/genericCharts/utils";
import {DataSourceFilterOptionsPayload, DataSourcePayload} from "@/types";

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
        console.log("Filter mutation with payload: " + JSON.stringify(payload.newValue))
        const chart = getChartFromSelections(state.selections, payload.step, payload.tabId, payload.chartIndex);
        chart.dataSources[payload.dataSourceId].selectedFilterOptions = payload.newValue;
        console.log(`updated data source ${payload.dataSourceId} filter selections tto ${JSON.stringify(payload.newValue)}`)
    }
};
