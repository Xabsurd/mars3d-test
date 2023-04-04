<template>
  <Header
    @changeMove="changeMove"
    @goModel="goModel"
    @goMountain="goMountain"
    v-on="measure.emits"
    v-show="state.loadend"
  ></Header>
  <main ref="mapdom" id="mapdom"></main>
</template>
<script setup lang="ts">
import Header from "./Header.vue";
import "mars3d-cesium/Build/Cesium/Widgets/widgets.css";
import "mars3d/dist/mars3d.css";
import { Cesium, Map } from "mars3d";
import { onMounted, reactive, ref } from "vue";
import { init, changeMove } from "./module/map";
import * as measure from "./module/measure";

const mapdom = ref(null);
const state = reactive({
  loadend: false,
});
let map: Map;
onMounted(() => {
  if (mapdom.value) {
    map = init(mapdom.value);
    measure.init(map);
    state.loadend = true;
    // create a polygon from points
  }
});
function goModel() {
  map.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(119.032216, 33.589536, 145.08),
    orientation: { heading: 0, pitch: (-22.9 / 180) * Math.PI },
  });
}
function goMountain() {
  map.camera.flyTo({
    destination: new Cesium.Cartesian3(-39390.01712376192, 5641386.600104815, 2985677.225726541),
    orientation: { heading: 0, pitch: (-22.9 / 180) * Math.PI },
  });
}

</script>

<style lang="scss">
main {
  z-index: 10;
  height:100vh;
}
</style>
