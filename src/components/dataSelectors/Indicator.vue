<template>
    <div>
        <div class="form-group">
            <label class="font-weight-bold" for="indicator">Indicator</label>
            <select v-model="selected" id="indicator" class="form-control">
                <option v-for="i in indicators" :value="i.id">
                    {{i.label}}
                </option>
            </select>
        </div>
    </div>
</template>

<script lang="ts">
    import {DatasetConfig, DataSourceConfig, IndicatorOption} from "@/types";
    import Vue from "vue";

    interface Props {
        indicators: IndicatorOption[]
        value: string
    }

    interface Computed {
        selected: string
    }

    interface Methods {
        initialise: () => void
    }

    export default Vue.extend<{}, Methods, Computed, Props>( {
        name: "Indicator",
        props: {
            indicators: {
                type: Array
            },
            value: {
                type: String
            }
        },
        computed: {
            selected: {
                get() {
                    return this.value;
                },
                set(newValue: string) {
                    this.$emit('update', newValue)
                }
            }
        },
        methods: {
            initialise() {
                //If no indicator is selected, pre-select the first one
                if (!this.value) {
                    console.log("updatting indicator from Indicator comp to " + this.indicators[0].id)
                    this.$emit('update', this.indicators[0].id)
                }
            }
        },
        mounted() {
            this.initialise();
        },
        watch: {
            value(newVal) {
                console.log("Indicator value was updated back in comp to " + newVal)
                this.initialise();
            }
        }
    });
</script>

<style scoped>

</style>
