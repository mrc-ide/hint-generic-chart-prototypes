<template>
    <div>
    <div ref="chart" style="width:800px; height:1000px;"></div>
    </div>
</template>

<script lang="ts">
    import Plotly from "plotly.js";
    import {
        computed,
        defineComponent,
        onMounted,
        ref,
        watch
    } from "@vue/composition-api";
    import jsonata from "jsonata";
    interface Props {
        chartMetadata: string,
        chartData: {data: Array<any>},
        layoutData: any
    }
    export default defineComponent({
        name: "Chart",
        props: {
            chartMetadata: String,
            chartData: Object,
            layoutData: Object
        },
        setup(props: Props) {

            const chart = ref(null);
            const inputData = computed(() => {
                return {
                    ...props.chartData,
                    ...props.layoutData
                };
            });
            const data = computed(() => {
                return jsonata(props.chartMetadata).evaluate(inputData.value);
            });
            function drawChart() {
                const el = chart.value as unknown;
                console.log("chart data: " + JSON.stringify(data.value.data))
                Plotly.react(el as HTMLElement, data.value.data, data.value.layout);
            }
            onMounted(() => {
                drawChart();
            });

            const chartMetadata = computed(() => {
                return props.chartMetadata;
            });

            watch([data, chartMetadata], () => {
                drawChart();
            });
            return {
                chart,
                data
            };
        }
    });
</script>
