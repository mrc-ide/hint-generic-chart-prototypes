import {GenericChartsState} from "@/store/genericCharts/state";
import {RootState} from "@/store/RootState";
import {ChartConfig, ChartData, ChartSelections, DatasetConfig, GenericChartsConfig} from "@/types";
import {expandDatasetFilters, getChartDataForChart} from "@/store/genericCharts/utils";

export const getters = {
    chartData: (state: GenericChartsState, getters: any, rootState: RootState) => {
        const result = {slots: []} as ChartData;
        const expandedConfig: GenericChartsConfig = getters.expandedConfig;
        expandedConfig.slots.forEach(slotConfig => {
            const stepNumber = slotConfig.stepNumber;
            const tabId = slotConfig.tabId;
            const slotSelections = state.selections.slots.find(s => s.stepNumber === stepNumber && s.tabId === tabId);
            const charts = (slotConfig.charts.map((c, index) => getChartDataForChart(state, rootState, c, slotSelections!.charts[index])));
            result.slots.push({
                stepNumber,
                tabId,
                charts
            });
        });
        return result;
    },
    expandedConfig: (state: GenericChartsState, getters: any, rootState:RootState): GenericChartsConfig => {
        const result = {...state.config};
        result.slots.forEach(s => {
            const charts = s.charts.map(c => {
                const datasets = c.datasets.map((d: DatasetConfig) => {
                    return {...d, filters: expandDatasetFilters(d, rootState)}
                });
                return {...c, datasets}
            });
            s.charts = charts;
        });
        return result;
    }
};
