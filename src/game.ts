import { Vector2, Vector3, WebGLRenderer } from 'three';
import { camera, scene } from './envirenment/scene';
import sea from './objects/sea';
// import sky from './objects/sky';
import airplane from './objects/airplane';

import './index.less';
import { loop } from './loop';
import Enemy from './objects/enemy';

class Game {
  private container = document.getElementById('world') as HTMLDivElement;

  public renderer = new WebGLRenderer({ 
    // 在 css 中设置背景色透明显示渐变色
    alpha: true, 
    // 开启抗锯齿，但这样会降低性能。
    // 不过，由于我们的项目基于低多边形的，那还好 :) 
    antialias: true 
  });

  public scene = scene;

  // 极限坐标
  public maxCoordinate = new Vector3();

  public get zMax() {
    return Math.abs(this.maxCoordinate.z);
  }

  public get xMax() {
    return Math.abs(this.maxCoordinate.x);
  }

  constructor() {
    // 添加大海
    this.scene.add(sea);
    // 添加天空
    // scene.add(sky);
    // 添加飞机
    this.scene.add(airplane);

    let enemy: Enemy | null = new Enemy();
    enemy.onDestroy(() => {
      scene.remove(enemy as Enemy);
      enemy = null;
    });

    this.scene.add(enemy);

    // 定义渲染器的尺寸；在这里它会填满整个屏幕
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // 打开渲染器的阴影地图
    this.renderer.shadowMap.enabled = true; 

    // 在 HTML 创建的容器中添加渲染器的 DOM 元素  
    this.container.appendChild(this.renderer.domElement);

    this.renderer.render(scene, camera);

    // 获取地图极限坐标
    this.maxCoordinate = this.convertTo3DCoordinate(window.innerWidth, window.innerHeight);

    // 监听屏幕，缩放屏幕更新相机和渲染器的尺寸
    window.addEventListener('resize', this.handleWindowResize, false);

    loop(time => {
      // 渲染场景
      this.renderer.render(scene, camera);
    });
  }

  // 屏幕坐标转
  private convertTo3DCoordinate(clientX: number, clientY: number) {
    const mv = new Vector3(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1,
      new Vector3(0, 100, 0).project(camera).z,
    );

    return mv.unproject(camera);
  }

  private handleWindowResize = () => { 
    // 更新渲染器的高度和宽度以及相机的纵横比
    const height = window.innerHeight;
    const width = window.innerWidth;
    this.renderer.setSize(width, height);
    camera.aspect = width / height;
    this.maxCoordinate = this.convertTo3DCoordinate(window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
  }
}

const game = new Game();

export default game;