import {GenericChartsState} from "@/store/genericCharts/state";
import {RootState} from "@/store/RootState";
import {ChartConfig, ChartSelections, DatasetConfig} from "@/types";

export const getters = {
    // Returns a method which returns all the data for a chart given its current selections - return a dictionary
    // where keys are dataset id and value is dataset
    chartData: (state: GenericChartsState, getters: any, rootState: RootState) => {
        return (chartConfig: ChartConfig, chartSelections: ChartSelections) => {
            let datasets = {} as any;
            chartConfig.datasets.forEach((config: DatasetConfig) => {
                if (config.type === "standard") {
                    datasets[config.id] = (rootState as any)[config.module!][config.prop!];
                } else {
                    throw "not supported";
                }
            });

            // Remove unselected datasets
            if (Object.keys(chartSelections.dataSources).length > 0) {
                const selectedDatasets = {} as any;
                Object.keys(chartSelections.dataSources).map(k => chartSelections.dataSources[k]).forEach(dsId => {
                    selectedDatasets[dsId] = datasets[dsId];
                });
                datasets = selectedDatasets;
            }

            return datasets;
        };
    }
};
