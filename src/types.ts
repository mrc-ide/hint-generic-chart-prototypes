export interface GenericChartsConfig {
    slots: SlotConfig[]
}

export interface SlotConfig
{
    stepNumber: number,
    tabId: string,
    charts: ChartConfig[]
}

export interface ChartConfig
{
    datasets: DatasetConfig[],
    dataSelectors: {
        dataSources: DataSourceConfig[]
    }
}

export interface DatasetConfig {
    id: string,
    type: "standard" | "custom",
    label: string,
    module?: string,
    prop?: string,
    filters?: Filter[]
}

export interface DataSourceConfig {
    id: string,
    type: "fixed" | "editable",
    label: string,
    datasetId: string
    showFilters: true
    showIndicators: true
}

export interface GenericChartsSelections {
    slots: {
        stepNumber: number,
        tabId: string,
        charts: ChartSelections[]

    }[]
}

export interface FilterOption {
    label: string;
    id: string;
}

export interface NestedFilterOption {
    label: string;
    id: string;
    children?: {
        [k: string]: any;
    }[];
}

export interface IndicatorOption {
    label: string;
    id: string;
}

export interface Filter {
    id: string,
    column_id: string,
    label: string,
    allowMultiple: boolean,
    optionsSource: "data" | "config",
    options: FilterOption[]
}

export interface ChartSelections {
    dataSources: Record<string, DataSourceSelections>
}

export interface ChartData {
    slots: {
        stepNumber: number,
        tabId: string,
        charts: Record<string, any>[]
    }[]
}

export interface DataSourceSelections {
    datasetId: string,
    indicatorId?: string,
    selectedFilterOptions?: Record<string, FilterOption[]>
}

export interface DataSourcePayload {
    step: number,
    tabId: string,
    chartIndex: number,
    dataSourceId: string,
    newValue: string
}
