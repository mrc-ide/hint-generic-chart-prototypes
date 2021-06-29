<template>
  <div id="app">
    <ChartSlot :step="1" tab-id="timeSeries"></ChartSlot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ChartSlot from "./components/ChartSlot.vue";

export default Vue.extend({
  name: 'App',
  components: {
    ChartSlot
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
