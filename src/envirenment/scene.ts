import * as THREE from 'three';
import Colors from '../colors';
import { hemisphereLight, shadowLight, ambientLight } from './light';

const scene = new THREE.Scene();

// 在场景中添加雾的效果；样式上使用和背景一样的颜色
// scene.fog = new THREE.Fog(Colors.LightYellow, 100, 950);
// 创建相机

const aspectRatio = window.innerWidth / window.innerHeight;   
const fieldOfView = 60;   
const nearPlane = 1;  
const farPlane = 10000;

/**
 * PerspectiveCamera 透视相机
 * @param fieldOfView 视角
 * @param aspectRatio 纵横比
 * @param nearPlane 近平面
 * @param farPlane 远平面
 */
const camera = new THREE.PerspectiveCamera(
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
camera.lookAt(0, 0, 0);
// 调整相机角度
camera.rotation.z -= 1.57;

scene.add(hemisphereLight, shadowLight, ambientLight);

export {
  scene,
  camera
};
