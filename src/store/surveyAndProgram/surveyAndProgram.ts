import {artData} from "@/data/art";
import {ancData} from "@/data/anc";
import {Module} from "vuex";
import {SurveyAndProgramState} from "@/store/surveyAndProgram/state";
import {RootState} from "@/store/RootState";

export const surveyAndProgramState: SurveyAndProgramState = {
    program: artData,
    anc: ancData
};

const namespaced = true;

export const surveyAndProgram: Module<SurveyAndProgramState, RootState> = {
    namespaced,
    state: surveyAndProgramState
};

