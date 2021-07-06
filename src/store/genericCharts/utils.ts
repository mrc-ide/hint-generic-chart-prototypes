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
            return {
                dataSources,
                chartConfigId: ""
            };
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
        const dsSelections = chartSelections.dataSources[dataSourceId];
        const datasetId = dsSelections.datasetId;

        const selectedFilterValues = dsSelections.selectedFilterOptions;

        dataSources[dataSourceId] = {...datasets[datasetId]};

        const filters = chartConfig.datasets.find(dsc => dsc.id === datasetId)!.filters;
        if (filters && selectedFilterValues) {
            const includeRow = (row: any, idx: number) => {
                let filterOutRow = false;
                for (const filter of filters) {
                    const filterValues = selectedFilterValues[filter.id]?.map(n => n.id);
                    if (filterValues?.indexOf(row[filter.column_id].toString()) < 0) {
                        filterOutRow = true;
                        break;
                    }
                }

                return !filterOutRow;
            };

            dataSources[dataSourceId].data = dataSources[dataSourceId].data.filter((row: any, idx: number) => includeRow(row, idx));
        }

        // If indicator Id is defined for the datasource, include 'value' column with that indicator's values
        if (dsSelections.indicatorId) {
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
      switch (f.optionsSource) {
          case "data":
              const dataset = getDatasetFromRootState(datasetConfig, rootState);
              const filter = {
                  ...f,
                  options: dataset.filters[f.id]
              };
              result.push(filter);
              break;
          case "shape":
              const shapeFilterOptions = [rootState.baseline.shape.filters.regions];
              const shapeFilter = {
                  ...f,
                  options: shapeFilterOptions
              };
              result.push(shapeFilter);
              break;
          case "config":
              result.push(f);
              break;
          default:
              throw "Filter source not supported"
      }
  });
  return result;
};
