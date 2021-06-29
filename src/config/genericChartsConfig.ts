// Notes on config:

// If dataset type is "standard" then we use data we already have in the standard HINT state, identifying it using the
// "module" and "prop" values. (This may be bad practice as it requires knowledge of HINT's internal state structure -
// could be replaced by an abstraction layer of configuration, which HINT maps to actual module and props.

// If dataset type is "custom" then we need to fetch that data from a (new) endpoint, providing the 'name' as a parameters.

// In dataSelectors, the first level of selection is dataSource - there may be one or more of these, and other data selectors
// e..g filters are relative to a data source. A datasource may  be fixed to a particular dataset or editable if user
// can select the dataset from a drop-down - in this case, datasetId is just the default

import {GenericChartsConfig} from "@/types";

export const genericChartsSampleConfig : GenericChartsConfig = {
    slots: [
        {
            stepNumber: 1,
            tabId: "timeSeries",
            charts: [
                {
                    datasets: [
                        {
                            id: "art",
                            type: "standard",
                            label: "ART",
                            module: "surveyAndProgram",
                            prop: "program"
                        },
                        {
                            id: "anc",
                            type: "standard",
                            label: "ANC",
                            module: "surveyAndProgram",
                            prop: "anc"
                        }
                    ],
                    dataSelectors: {
                        dataSources: [
                            {
                                id: "data",
                                type: "editable",
                                label: "Data source",
                                datasetId: "art"
                            }
                        ]
                    }
                }
            ]
        }
    ]
};
