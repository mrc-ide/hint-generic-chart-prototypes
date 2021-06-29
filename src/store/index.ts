import Vue from 'vue'
import Vuex, {StoreOptions} from 'vuex'
import {RootState} from "@/store/RootState";
import {surveyAndProgram, surveyAndProgramState} from "@/store/surveyAndProgram/surveyAndProgram";
import {genericCharts, genericChartsState} from "@/store/genericCharts/genericCharts";

Vue.use(Vuex);

const initialState: RootState = {
  surveyAndProgram: surveyAndProgramState,
  genericCharts: genericChartsState
};

const storeOptions: StoreOptions<RootState> = {
  state: initialState,
  modules: {
    surveyAndProgram,
    genericCharts
  }
};

export default new Vuex.Store(storeOptions);
