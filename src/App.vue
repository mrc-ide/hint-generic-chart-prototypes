<template>
  <div id="app" class="container">
    <ChartSlot :step="1" tab-id="timeSeries" chart-height="500px"></ChartSlot>
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
@import '../node_modules/bootstrap/scss/bootstrap.scss';
@import "../node_modules/@riophae/vue-treeselect/dist/vue-treeselect";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;

  label {
    display: block;
  }
}
</style>
