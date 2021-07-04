import {SurveyAndProgramState} from "@/store/surveyAndProgram/state";
import {GenericChartsState} from "@/store/genericCharts/state";
import {BaselineState} from "@/store/baseline/state";

export interface RootState {
    baseline: BaselineState,
    surveyAndProgram: SurveyAndProgramState,
    genericCharts: GenericChartsState
}
