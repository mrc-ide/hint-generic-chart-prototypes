import {GenericChartsConfig} from "@/types";

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
