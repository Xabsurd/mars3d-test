import { Cesium } from "mars3d";
import { cloneDeep } from "lodash";
export type Move3DTileType = {
  start: Function;
  stop: Function;
};
export function Move3DTile(v: Cesium.Viewer): Move3DTileType {
  let CanMove = false, //是否可以移动
    LEFT_DOWN = false, //是否为左键选中目标
    LEFT_DOWN_Point: Cesium.Cartographic, //左键选中目标时的经纬度坐标
    RIGHT_DOWN = false, //是否为右键选中目标
    RIGHT_DOWN_Point: Cesium.Cartesian2, //右键选中目标时的经纬度坐标
    pickModel: Cesium.Cesium3DTileset, //选中的模型
    pickModel_Point: Cesium.Cartographic, //选中模型的经纬度坐标
    handle: Cesium.ScreenSpaceEventHandler | null, //事件句柄
    viewer = v, //地图viewer
    orgTerrain: boolean; //原始的Terrain
  let center: Cesium.Cartesian3; //模型的中心点卡迪尔坐标
  let d_mat: Cesium.Matrix4; //模型的矩阵
  function start() {
    //获取句柄
    handle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    //可以移动
    CanMove = true;
    //绑定左键按下事件
    handle.setInputAction(function (e: Cesium.ScreenSpaceEventHandler.PositionedEvent) {
      const picker = viewer.scene.pick(e.position);
      if (picker) {
        pickModel = picker.primitive;
        center = cloneDeep(pickModel.boundingSphere.center);
        d_mat = cloneDeep(pickModel.modelMatrix);
        pickModel_Point = Cesium.Cartographic.fromCartesian(center);
        LEFT_DOWN_Point = Cesium.Cartographic.fromCartesian(viewer.scene.pickPosition(e.position));
        viewer.scene.screenSpaceCameraController.enableRotate = false;
        LEFT_DOWN = true;
        orgTerrain = viewer.scene.globe.depthTestAgainstTerrain;
        viewer.scene.globe.depthTestAgainstTerrain = false;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    //绑定左键抬起事件
    handle.setInputAction(function () {
      LEFT_DOWN = false;
      viewer.scene.screenSpaceCameraController.enableRotate = true;
      viewer.scene.globe.depthTestAgainstTerrain = orgTerrain;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
    //绑定右键按下事件
    handle.setInputAction(function (e: Cesium.ScreenSpaceEventHandler.PositionedEvent) {
      const picker = viewer.scene.pick(e.position);
      if (picker) {
        pickModel = picker.primitive;
        center = cloneDeep(pickModel.boundingSphere.center);
        d_mat = cloneDeep(pickModel.modelMatrix);
        pickModel_Point = Cesium.Cartographic.fromCartesian(center);
        RIGHT_DOWN_Point = e.position;
        RIGHT_DOWN = true;
        viewer.scene.screenSpaceCameraController.enableZoom = false;
        orgTerrain = viewer.scene.globe.depthTestAgainstTerrain;
        viewer.scene.globe.depthTestAgainstTerrain = false;
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_DOWN);
    //绑定右键抬起事件
    handle.setInputAction(function () {
      RIGHT_DOWN = false;
      viewer.scene.screenSpaceCameraController.enableZoom = true;
      viewer.scene.globe.depthTestAgainstTerrain = orgTerrain;
    }, Cesium.ScreenSpaceEventType.RIGHT_UP);
    //鼠标移动事件
    handle.setInputAction(function (e: Cesium.ScreenSpaceEventHandler.MotionEvent) {
      if (LEFT_DOWN) {
        var p = Cesium.Cartographic.fromCartesian(viewer.scene.pickPosition(e.endPosition));
        var nplng = pickModel_Point.longitude + p.longitude - LEFT_DOWN_Point.longitude;
        var nplat = pickModel_Point.latitude + p.latitude - LEFT_DOWN_Point.latitude;
        var offset = Cesium.Cartesian3.fromRadians(nplng, nplat, pickModel_Point.height);
        changePosition(pickModel, offset);
      }
      if (RIGHT_DOWN) {
        var num = RIGHT_DOWN_Point.y - e.endPosition.y;
        var offset = Cesium.Cartesian3.fromRadians(
          pickModel_Point.longitude,
          pickModel_Point.latitude,
          pickModel_Point.height + num
        );
        changePosition(pickModel, offset);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    //修改位置
    function changePosition(tiles: Cesium.Cesium3DTileset, _offset: Cesium.Cartesian3) {
      const mat = new Cesium.Matrix4(
        d_mat[0],
        d_mat[4],
        d_mat[8],
        d_mat[12] - center.x + _offset.x,
        d_mat[1],
        d_mat[5],
        d_mat[9],
        d_mat[13] - center.y + _offset.y,
        d_mat[2],
        d_mat[6],
        d_mat[10],
        d_mat[14] - center.z + _offset.z,
        d_mat[3],
        d_mat[7],
        d_mat[11],
        d_mat[15]
      );
      tiles.modelMatrix = mat;
    }
  }
  //停止移动
  function stop() {
    handle?.destroy();
    handle = null;
    CanMove = false;
    LEFT_DOWN = false;
    RIGHT_DOWN = false;
  }
  return {
    start,
    stop,
  };
}