import {genericChartsSampleConfig} from "@/config/genericChartsConfig";
import {Module} from "vuex";
import {GenericChartsState} from "@/store/genericCharts/state";
import {RootState} from "@/store/RootState";
import {getters} from "./getters";
import {mutations} from "./mutations";
import {initialiseSelections} from "@/store/genericCharts/utils";

export const genericChartsState:GenericChartsState = {
    config: genericChartsSampleConfig,
    selections: initialiseSelections(genericChartsSampleConfig)
};

const namespaced = true;

export const genericCharts: Module<GenericChartsState, RootState> = {
    namespaced,
    state: genericChartsState,
    getters,
    mutations
};

