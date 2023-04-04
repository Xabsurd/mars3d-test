<template>
  <header>
    <ElButton @click="emit('goModel', $event)" type="primary">到倾斜摄影</ElButton>
    <ElButton @click="emit('goMountain', $event)" type="primary">到山区</ElButton>
    <ElButton @click="emit('measureLength', $event)">空间距离</ElButton>
    <ElButton @click="emit('measureSurfaceLength', $event)">贴地距离</ElButton>
    <ElButton @click="emit('measureArea', $event)">水平面积</ElButton>
    <ElButton @click="emit('measureSurfaceeArea', $event)">贴地面积</ElButton>
    <ElButton @click="emit('measureHeight', $event)">高度差</ElButton>
    <ElButton @click="emit('measureTriangleHeight', $event)">三角测量</ElButton>
    <ElButton @click="emit('measureAngle', $event)">方位角</ElButton>
    <ElButton @click="emit('measurePoint', $event)">坐标测量</ElButton>
    <ElButton @click="emit('removeAll', $event)">清除</ElButton>

    <ElButton @click="emit('cutMeasure', state.cutHeight)">土方量</ElButton>
    <div class="slider">
      <span>粒度:</span>
      <el-slider
        v-model="state.granularity"
        @change="emit('changeGranularity', $event)"
        :min="15"
        :max="25"
      />
    </div>
    <el-input-number v-model="state.cutHeight" />
    <ElButton @click="getHeight">高度拾取</ElButton>
    开启模型移动<ElSwitch v-model="state.isMove" @change="changeMove"></ElSwitch>
  </header>
</template>
<script setup lang="ts">
import { reactive, defineEmits } from "vue";
const emit = defineEmits([
  "changeMove",
  "measureLength",
  "measureSurfaceLength",
  "measureArea",
  "measureSurfaceeArea",
  "measureHeight",
  "measureTriangleHeight",
  "measureAngle",
  "measurePoint",
  "removeAll",
  "cutMeasure",
  "goModel",
  "goMountain",
  "changeGranularity",
  "getHeight",
]);
const state = reactive({
  isMove: false,
  granularity: 19,
  cutHeight: 100,
});
function changeMove() {
  emit("changeMove", state.isMove);
}
function getHeight() {
  emit("getHeight", (val: number) => {
    state.cutHeight = val;
  });
}
</script>
<style lang="scss">
header {
  position: absolute;
  top: 0px;
  left: 0px;
  padding-right: 200px;
  background-color: #0000002c;
  color: #fff;
  z-index: 11;
}
.slider {
  width: 300px;
  height: 32px;
  line-height: 32px;
  display: inline-flex;
  span {
    min-width: 40px;
  }
}
</style>
