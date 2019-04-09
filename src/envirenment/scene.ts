import { PerspectiveCamera, Scene, Fog, Vector3, Euler } from 'three';
import { hemisphereLight, shadowLight, ambientLight } from './light';
import Colors from '../colors';
import { loop, cancelLoop } from '../loop';

const scene = new Scene();

// 在场景中添加雾的效果；样式上使用和背景一样的颜色
scene.fog = new Fog(Colors.LightYellow, 100, 950);
// 创建相机

const aspectRatio = window.innerWidth / window.innerHeight;   
const fieldOfView = 60;   
const nearPlane = 100;  
const farPlane = 1000;

/**
 * PerspectiveCamera 透视相机
 * @param fieldOfView 视角
 * @param aspectRatio 纵横比
 * @param nearPlane 近平面
 * @param farPlane 远平面
 */
const camera = new PerspectiveCamera(
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane
);

// 设置相机的位置
camera.position.x = 0;
camera.position.z = 0;
camera.position.y = 600;

// 让相机从上方往下看
camera.lookAt(0, 100, 0);
// 调整相机角度
camera.rotation.z -= Math.PI / 2;

scene.add(hemisphereLight, shadowLight, ambientLight);

function moveCamera(to: Vector3, frame: number) {
  return new Promise((resolve) => {

    const xshift = to.x - camera.position.x;
    const yshift = to.y - camera.position.y;
    const zshift = to.z - camera.position.z;

    let now = 0;

    const flag = loop(() => {
      if (now > frame) {
        resolve();
        return cancelLoop(flag);
      } else {
        camera.position.x += xshift / frame;
        camera.position.y += yshift / frame;
        camera.position.z += zshift / frame;
      }
      camera.lookAt(0, 100, 0);
      now += 1;
    });
  });
}
export {
  scene,
  camera,
  moveCamera,
};
