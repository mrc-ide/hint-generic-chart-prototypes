import Vue from 'vue'
import Vuex, {StoreOptions} from 'vuex'
import CompositionApi from "@vue/composition-api"
import {RootState} from "@/store/RootState";
import {surveyAndProgram, surveyAndProgramState} from "@/store/surveyAndProgram/surveyAndProgram";
import {genericCharts, genericChartsState} from "@/store/genericCharts/genericCharts";
import {baseline, baselineState} from "@/store/baseline/baseline";

Vue.use(Vuex);
Vue.use(CompositionApi);

const initialState: RootState = {
  baseline: baselineState,
  surveyAndProgram: surveyAndProgramState,
  genericCharts: genericChartsState
};

const storeOptions: StoreOptions<RootState> = {
  state: initialState,
  modules: {
    baseline,
    surveyAndProgram,
    genericCharts
  }
};

export default new Vuex.Store(storeOptions);
