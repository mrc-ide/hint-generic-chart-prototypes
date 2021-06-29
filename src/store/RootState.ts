import {SurveyAndProgramState} from "@/store/surveyAndProgram/state";
import {GenericChartsState} from "@/store/genericCharts/state";

export interface RootState {
    surveyAndProgram: SurveyAndProgramState,
    genericCharts: GenericChartsState
}
