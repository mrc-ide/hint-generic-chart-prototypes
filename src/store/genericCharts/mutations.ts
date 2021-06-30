import {MutationTree} from "vuex";
import {GenericChartsState} from "@/store/genericCharts/state";
import {getChartFromSelections} from "@/store/genericCharts/utils";
import {DataSourcePayload} from "@/types";

export const mutations: MutationTree<GenericChartsState> = {
    setDataSource(state: GenericChartsState, payload: DataSourcePayload) {
        const chart = getChartFromSelections(state.selections, payload.step, payload.tabId, payload.chartIndex);
        chart.dataSources[payload.dataSourceId] = payload.newValue;
    }
};
