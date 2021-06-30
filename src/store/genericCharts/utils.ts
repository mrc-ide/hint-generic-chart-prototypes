import {ChartConfig, ChartSelections, GenericChartsConfig, GenericChartsSelections} from "@/types";

export const initialiseSelections = (config: GenericChartsConfig) => {
    const result = {slots: [] as any};
    config.slots.forEach(s => {
        const charts = s.charts.map(c => {
            const dataSources = {} as Record<string, string>;
            c.dataSelectors.dataSources.forEach(d => {
                dataSources[d.id] = d.datasetId
            });
            return {dataSources};
        });
        result.slots.push({
            stepNumber: s.stepNumber,
            tabId: s.tabId,
            charts
        });
    });
    return result;
};

export const getChartFromConfig = (config: GenericChartsConfig, step: number, tabId: string, chartIndex: number): ChartConfig => {
    const slot = config.slots.find(s => s.stepNumber === step && s.tabId === tabId)!;
    return slot.charts[chartIndex];
};

export const getChartFromSelections = (selections: GenericChartsSelections, step: number, tabId: string, chartIndex: number): ChartSelections => {
    const slot = selections.slots.find(s => s.stepNumber === step && s.tabId === tabId)!;
    return slot.charts[chartIndex];
};
