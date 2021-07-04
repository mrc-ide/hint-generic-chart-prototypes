<template>
    <div>
        <h4>Filters</h4>
        <div :id="'filter-' + filter.id" v-for="filter in filters" :key="filter.id" class="form-group">
            <filter-select :value="getSelectedFilterValues(filter.id)"
                           :multiple="filter.allowMultiple"
                           :label="filter.label"
                           :options="filter.options"
                           :disabled="filter.options.length===0"
                           @select="onFilterSelect(filter, $event)"></filter-select>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import FilterSelect from "./FilterSelect.vue";
    import {Filter, FilterOption} from "../../types";
    import {flattenOptions} from "@/store/genericCharts/utils";

    interface Props {
        filters: Filter[],
        selectedFilterOptions: Record<string, FilterOption[]>,
    }

    interface Methods {
        getSelectedFilterValues: (filterId: string) => string[],
        onFilterSelect: (filter: Filter, selectedOptions: FilterOption[]) => void
        initialise: () => void
    }

    const props = {
        filters: {
            type: Array
        },
        selectedFilterOptions: {
            type: Object
        }
    };

    export default Vue.extend<unknown, Methods, unknown, Props>({
        name: "Filters",
        components: {FilterSelect},
        props: props,
        methods: {
            getSelectedFilterValues(filterId: string) {
                return (this.selectedFilterOptions[filterId] || []).map(o => o.id);
            },
            onFilterSelect(filter: Filter, selectedOptions: FilterOption[]) {
                const newSelectedFilterOptions = {...this.selectedFilterOptions};
                newSelectedFilterOptions[filter.id] = selectedOptions;

                this.$emit("update", newSelectedFilterOptions);
            },
            initialise() {
                //initialise selections - will have to do this if values change as well
                const defaultSelected = this.filters.reduce((obj: any, current: Filter) => {
                    obj[current.id] = Object.values(flattenOptions([current.options[0]]));
                    return obj;
                }, {} as Record<string, FilterOption[]>);
                this.$emit("update", defaultSelected);

            }
        },
        created() {
            this.initialise();
        },
        watch: {
            filters() {
                this.initialise();
            }
        }
    });
</script>
