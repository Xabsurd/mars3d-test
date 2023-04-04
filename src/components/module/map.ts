import * as mars3d from "mars3d";
import { Move3DTile, Move3DTileType } from "../../utils/3dtile";
let map: mars3d.Map;
let tiles3dLayer: mars3d.layer.TilesetLayer | null;
let move: Move3DTileType;
export function init(mapdom: HTMLElement): mars3d.Map {
  map = new mars3d.Map(mapdom as any, {
    scene: {
      center: {
        lat: 30.054604,
        lng: 108.885436,
        alt: 17036414,
        heading: 0,
        pitch: -90,
      },
      showSun: true,
      showMoon: true,
      showSkyBox: true,
      showSkyAtmosphere: false, // 关闭球周边的白色轮廓 map.scene.skyAtmosphere = false
      fog: true,
      fxaa: true,
      globe: {
        showGroundAtmosphere: false, // 关闭大气（球表面白蒙蒙的效果）
        depthTestAgainstTerrain: false,
        baseColor: "#546a53",
      },
      cameraController: {
        zoomFactor: 3.0,
        minimumZoomDistance: 1,
        maximumZoomDistance: 50000000,
        enableRotate: true,
        enableZoom: true,
      },
    },
    control: {
      baseLayerPicker: true, // basemaps底图切换按钮
      homeButton: true, // 视角复位按钮
      sceneModePicker: true, // 二三维切换按钮
      navigationHelpButton: true, // 帮助按钮
      fullscreenButton: true, // 全屏按钮
      contextmenu: { hasDefault: true }, // 右键菜单
    },
    terrain: {
      url: "//data.mars3d.cn/terrain",
      show: true,
    },
    basemaps: [
      {
        name: "天地图影像",
        icon: "img/basemaps/tdt_img.png",
        type: "tdt",
        layer: "img_d",
        show: true,
      } as any,
    ],
  });
  // map.terrainProvider = mars3d.LayerUtil.createTerrainProvider({
  //   url: "http://data.mars3d.cn/terrain",
  // } as any);
  showQxSimiaoDemo();
  move = Move3DTile(map.viewer);
  return map;
}

export function changeMove(isMove: boolean) {
  console.log(isMove);

  if (move) {
    if (isMove) {
      move.start();
    } else {
      move.stop();
    }
  }
}
/**
 * 移除图层
 *
 * @returns {void}
 */
function removeLayer() {
  if (tiles3dLayer) {
    map.basemap = 2021; // 切换到默认影像底图

    map.removeLayer(tiles3dLayer, true);
    tiles3dLayer = null;
  }
}
/**
 * 倾斜摄影 景区文庙
 *
 * @export showJzwHefeiDemo 倾斜摄影
 * @returns {void}
 */
export function showQxSimiaoDemo() {
  removeLayer();

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "文庙",
    url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
    position: { alt: 80.6 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    center: {
      lat: 33.589536,
      lng: 119.032216,
      alt: 145.08,
      heading: 3.1,
      pitch: -22.9,
      roll: 0,
    },
    flyTo: true,
  });
  map.addLayer(tiles3dLayer);

  // 加载的事件 只执行一次
  tiles3dLayer.on(mars3d.EventType.initialTilesLoaded, function (event) {
    console.log("触发initialTilesLoaded事件", event);
  });
}

export { map, move };
