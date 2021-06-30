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
    prop?: string
}

export interface DataSourceConfig {
    id: string,
    type: "fixed" | "editable",
    label: string,
    datasetId: string
}

export interface GenericChartsSelections {
    slots: {
        stepNumber: number,
        tabId: string,
        charts: ChartSelections[]

    }[]
}

export interface ChartSelections {
    dataSources: Record<string, string>
}

export interface DataSourcePayload {
    step: number,
    tabId: string,
    chartIndex: number,
    dataSourceId: string,
    newValue: string
}
