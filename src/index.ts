import * as THREE from 'three';
import { camera, scene } from './envirenment/scene';
import sea from './objects/sea';
// import sky from './objects/sky';
import airplane from './objects/airplane';

import './index.less';
import { loop } from './loop';
import Enemy from './objects/enemy';

// 添加大海
scene.add(sea);
// 添加天空
// scene.add(sky);
// 添加飞机
scene.add(airplane);

let enemy: Enemy | null = new Enemy();
enemy.onDestroy(() => {
  scene.remove(enemy as Enemy);
  enemy = null;
});

scene.add(enemy);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ 
  // 在 css 中设置背景色透明显示渐变色
  alpha: true, 
  // 开启抗锯齿，但这样会降低性能。
  // 不过，由于我们的项目基于低多边形的，那还好 :) 
  antialias: true 
});
  
// 定义渲染器的尺寸；在这里它会填满整个屏幕
renderer.setSize(window.innerWidth, window.innerHeight);

// 打开渲染器的阴影地图
renderer.shadowMap.enabled = true; 

// 在 HTML 创建的容器中添加渲染器的 DOM 元素
const container = document.getElementById('world') as HTMLDivElement;   
container.appendChild(renderer.domElement);

// 监听屏幕，缩放屏幕更新相机和渲染器的尺寸
window.addEventListener('resize', handleWindowResize, false);

function handleWindowResize() { 
  // 更新渲染器的高度和宽度以及相机的纵横比
  const height = window.innerHeight;
  const width = window.innerWidth;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

loop(time => {
  // 渲染场景
  renderer.render(scene, camera);
});
