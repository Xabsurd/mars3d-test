import { Map, thing, EventType, Cesium } from "mars3d";
import { cutMeasure } from "../../utils/cutMeasure";
let measure: thing.Measure;
let cut: cutMeasure;
let map: Map;
export function init(_map: Map) {
  map = _map;
  measure = new thing.Measure({
    label: {
      color: "#ffffff",
      font_family: "楷体",
      font_size: 20,
      background: false,
    },
  });
  map.addThing(measure);

  measure.on(EventType.start, function (e) {
    console.log("开始异步分析", e);
  });
  measure.on(EventType.end, function (e) {
    console.log("完成异步分析", e);
  });
  cut = new cutMeasure(map.viewer);
}
//所有的事件函数
export const emits = {
  // 空间距离
  measureLength() {
    measure.distance({
      showAddText: true,

      label: {
        // 自定义显示label的graphic类型
        type: "div",
        updateText: function (text: string, graphic: any) {
          // updateText是必须，用于动态更新 text
          graphic.html = `<div class="marsGreenGradientPnl" >${text}</div>`;
        },
        // 下面是graphic对应类型本身的参数
        html: `<div class="marsGreenGradientPnl" ></div>`,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      },
    } as any);
  },
  //// 贴地距离
  measureSurfaceLength() {
    measure.distanceSurface({
      showAddText: true,
      exact: false, // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
    });
  },
  // 水平面积
  measureArea() {
    measure.area({});
  },
  // 贴地面积
  measureSurfaceeArea() {
    measure.areaSurface({
      style: {
        color: "#ffff00",
      },
      splitNum: 10, // step插值分割的个数
      exact: false, // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
    });
  },
  // 高度差
  measureHeight() {
    measure.height();
  },
  // 三角测量
  measureTriangleHeight() {
    measure.heightTriangle();
  },
  // 方位角
  measureAngle() {
    measure.angle();
  },
  // 坐标测量
  measurePoint() {
    measure.point();
  },
  removeAll() {
    measure.clear();
    cut.clearMeasure();
  },
  cutMeasure(height: number) {
    cut.createCutVolumeAnalysis(height).then((data) => {});
  },
  changeGranularity(val: number) {
    console.log(val);

    cut.changeGranularity(val);
  },
  getHeight(callback: Function) {
    const handle = new Cesium.ScreenSpaceEventHandler(map.viewer.scene.canvas);
    const orgTerrain = map.viewer.scene.globe.depthTestAgainstTerrain;
    map.viewer.scene.globe.depthTestAgainstTerrain = true;
    handle.setInputAction(function onMouseClick(
      event: Cesium.ScreenSpaceEventHandler.PositionedEvent
    ) {
      var earthPosition = map.viewer.scene.pickPosition(event.position);
      const position = Cesium.Cartographic.fromCartesian(earthPosition);
      map.viewer.scene.globe.depthTestAgainstTerrain = orgTerrain;
      handle.destroy();
      callback(position.height);
    },
    Cesium.ScreenSpaceEventType.LEFT_CLICK);
  },
};
