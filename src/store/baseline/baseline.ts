import {shapeData} from "@/data/shape";
import {Module} from "vuex";
import {BaselineState} from "@/store/baseline/state";
import {RootState} from "@/store/RootState";

export const baselineState: BaselineState = {
    shape: shapeData,
};

const namespaced = true;

export const baseline: Module<BaselineState, RootState> = {
    namespaced,
    state: baselineState
};

