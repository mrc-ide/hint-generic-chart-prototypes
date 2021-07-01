import {
    ChartConfig,
    ChartSelections, DatasetConfig,
    DataSourceSelections, Filter,
    GenericChartsConfig,
    GenericChartsSelections, NestedFilterOption
} from "@/types";
import {GenericChartsState} from "@/store/genericCharts/state";
import {RootState} from "@/store/RootState";

export const initialiseSelections = (config: GenericChartsConfig) => {
    const result = {slots: [] as any};
    config.slots.forEach(s => {
        const charts = s.charts.map(c => {
            const dataSources = {} as Record<string, DataSourceSelections>;
            c.dataSelectors.dataSources.forEach(d => {
                const datasetId = d.datasetId;
                dataSources[d.id] = {
                    datasetId,
                    indicatorId: undefined,
                    selectedFilterOptions: undefined
                }
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

const getDatasetFromRootState = (datasetConfig: DatasetConfig, rootState: RootState) => {
    return (rootState as any)[datasetConfig.module!][datasetConfig.prop!]
};

export const getChartDataForChart = (state: GenericChartsState, rootState: RootState, chartConfig: ChartConfig, chartSelections: ChartSelections) => {
    let datasets = {} as any;
    chartConfig.datasets.forEach((config: DatasetConfig) => {
        if (config.type === "standard") {
            datasets[config.id] = getDatasetFromRootState(config, rootState);
        } else {
            throw "not supported";
        }
    });

    const dataSources = {} as any;
    Object.keys(chartSelections.dataSources).forEach(dataSourceId => {
        dataSources[dataSourceId] = datasets[chartSelections.dataSources[dataSourceId].datasetId]

        // If indicator Id is defined for the datasource, include 'value' column with that indicator's values
        const dsSelections = chartSelections.dataSources[dataSourceId];
        if (dsSelections.indicatorId) {
            console.log("Adding value column to item")
            dataSources[dataSourceId].data = dataSources[dataSourceId].data.map((item: any) => {
                return {...item, value: item[dsSelections.indicatorId!]}
            });
        }

    });

    return dataSources;
};

export const flattenOptions = (filterOptions: NestedFilterOption[]): { [k: string]: NestedFilterOption } => {
    let result = {};
    filterOptions.forEach(r =>
        result = {
            ...result,
            ...flattenOption(r)
        });
    return result;
};

const flattenOption = (filterOption: NestedFilterOption): NestedFilterOption => {
    let result = {} as any;
    result[filterOption.id] = filterOption;
    if (filterOption.children) {
        filterOption.children.forEach(o =>
            result = {
                ...result,
                ...flattenOption(o as NestedFilterOption)
            });

    }
    return result;
};

export const expandDatasetFilters = (datasetConfig: DatasetConfig, rootState: RootState) => {
  //Expand configured dataset filters to include filters from data if required
  const result: Filter[] = [];
  datasetConfig.filters?.forEach(f => {
      if (f.optionsSource === "data") {
          const dataset = getDatasetFromRootState(datasetConfig, rootState);
          const filter = {
              ...f,
              options: dataset.filters[f.id]
          };
          result.push(filter);
      } else {
          result.push(f);
      }
  });
  return result;
};
