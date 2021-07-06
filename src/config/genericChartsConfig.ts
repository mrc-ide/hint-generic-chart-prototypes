// Notes on config:

// If dataset type is "standard" then we use data we already have in the standard HINT state, identifying it using the
// "module" and "prop" values. (This may be bad practice as it requires knowledge of HINT's internal state structure -
// could be replaced by an abstraction layer of configuration, which HINT maps to actual module and props.

// If dataset type is "custom" then we would need to fetch that data from a (new) endpoint, providing the 'name' as a parameters.

// In dataSelectors, the first level of selection is dataSource - there may be one or more of these, and other data selectors
// e.g filters are relative to a data source. DataSources represent how datasets are used in each chart - e.g  may have a single datasource,
// or separate for x & y axis. A dataSource can be fixed or editable - if editable, user can select the dataset
// to use for the data source, if fixed, the data source is fixed to the default dataset id.

// Shown here is configuration for filter options which are derived from the dataset (included in the same response
// as the data) and from the Shape response (a special case for area filters). Could also provide custom filter options
// per chart, defined in the dataset config.

// Default filter options are not implemented in the prototype - first options are selected

import {FilterOption, GenericChartsConfig} from "@/types";

export const genericChartsSampleConfig : GenericChartsConfig = {
    slots: [
        {
            stepNumber: 1,
            tabId: "timeSeries",
            charts: [
                {
                    datasets: [ //Datasets are the available sets of data to the chart
                        {
                            id: "art",
                            type: "standard",
                            label: "ART",
                            module: "surveyAndProgram",
                            prop: "program",
                            //Filters are defined for the dataset not the datasource as they may differ across datasets
                            filters: [
                                {
                                    id: "age",
                                    column_id: "age_group",
                                    label: "Age",
                                    allowMultiple: false,
                                    optionsSource: "data", // The options for this filter will be defined in the dataset, in the 'filters' property
                                    options: []
                                },
                                {
                                    id: "area",
                                    column_id: "area_id",
                                    label: "Area",
                                    allowMultiple: true,
                                    optionsSource: "shape", // The options for this filter will be defined by the areas in the Shape response in the baseline state
                                    options: []
                                }
                            ]
                        },
                        {
                            id: "anc",
                            type: "standard",
                            label: "ANC",
                            module: "surveyAndProgram",
                            prop: "anc",
                            filters: [
                                {
                                    id: "area",
                                    column_id: "area_id",
                                    label: "Area",
                                    allowMultiple: true,
                                    optionsSource: "shape",
                                    options: []
                                }
                            ]
                        }
                    ],
                    dataSelectors: {
                        dataSources: [
                            {
                                id: "data",
                                type: "editable",
                                label: "Data source",
                                datasetId: "art",
                                showIndicators: true,
                                showFilters: true
                            }
                        ]
                    },
                    chartConfig: [
                        {
                            id: "scatter",
                            label: "Scatter",
                            config: `{
                                "data":$map($filter(data.area_name, function($v, $i) {$i < 31}), function($v, $i) {
                                    {
                                        "name": $v,
                                        "showlegend": false,
                                        "x": data[area_name=$v].year,
                                        "y": data[area_name=$v].value,
                                        "xaxis": 'x' & $i,
                                        "yaxis": 'y' & $i,
                                        "type": "scatter"
                                    }
                                }),
                                "layout": {                            
                                    "grid": {"columns": 3, "rows": 10, "pattern": 'independent'}
                                }
                            }`
                        },
                        {
                            id: "bar",
                            label: "Bar",
                            config: `{
                                "data":$map($filter(data.area_name, function($v, $i) {$i < 31}), function($v, $i) {
                                    {
                                        "name": $v,
                                        "showlegend": false,
                                        "x": data[area_name=$v].year,
                                        "y": data[area_name=$v].value,
                                        "xaxis": 'x' & $i,
                                        "yaxis": 'y' & $i,
                                        "type": "bar"
                                    }
                                }),
                                "layout": {                            
                                    "grid": {"columns": 3, "rows": 10, "pattern": 'independent'}
                                }
                            }`
                        }
                    ]
                }
            ]
        }
    ]
};
