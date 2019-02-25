import * as THREE from 'three';
import Colors from '../colors';
import { loop } from '../loop';

enum DirectionKeys {
  UP = 'KeyW',
  LEFT = 'KeyA',
  DOWN = 'KeyS',
  RIGHT = 'KeyD',
}

class AirPlane extends THREE.Object3D {

  // 创建机舱
  private cockpit = new THREE.Mesh(
    new THREE.BoxGeometry(60, 50, 50, 1, 1, 1),
    new THREE.MeshPhongMaterial({
      color: Colors.Red,
      flatShading: true,
    }),
  );
  
  // 创建引擎
  private engine = new THREE.Mesh(
    new THREE.BoxGeometry(20, 50, 50, 1, 1, 1),
    new THREE.MeshPhongMaterial({
      color: Colors.White,
      flatShading: true,
    }),
  );

  // 创建机尾
  private tail = new THREE.Mesh(
    new THREE.BoxGeometry(15, 20, 5, 1, 1, 1),
    new THREE.MeshPhongMaterial({
      color: Colors.Red,
      flatShading: true,
    }),
  );

  private wing = new THREE.Mesh(
    new THREE.BoxGeometry(40, 8, 150, 1, 1, 1),
    new THREE.MeshPhongMaterial({
      color: Colors.Red,
      flatShading: true,
    }),
  );

  private propeller = new THREE.Mesh(
    new THREE.BoxGeometry(20, 10, 10, 1, 1, 1),
    new THREE.MeshPhongMaterial({
      color: Colors.Brown,
      flatShading: true,
    }),
  );

  private blade = new THREE.Mesh(
    new THREE.BoxGeometry(1, 100, 20, 1, 1, 1),
    new THREE.MeshPhongMaterial({
      color: Colors.BrownDark,
      flatShading: true,
    }),
  );

  private speed: Readonly<number> = 2;
  
  private pressDirectionKeys: { [key: string]: boolean} = {
    [DirectionKeys.UP]: false,
    [DirectionKeys.LEFT]: false,
    [DirectionKeys.DOWN]: false,
    [DirectionKeys.RIGHT]: false,
  };

  private maxRoatation: Readonly<number> = 0.6;
  private rotateSpeed: Readonly<number> = 0.05;

  constructor() {
    super();

    // 机舱
    this.cockpit.castShadow = true;
    this.cockpit.receiveShadow = true;
    this.add(this.cockpit);

    // 引擎
    this.engine.position.x = 40;
    this.engine.castShadow = true;
    this.engine.receiveShadow = true;
    this.add(this.engine);

    // 机尾
    this.tail.position.set(-35, 25, 0);
    this.tail.castShadow = true;
    this.tail.receiveShadow = true;
    this.add(this.tail);

    // 翅膀
    this.wing.castShadow = true;
    this.wing.receiveShadow = true;
    this.add(this.wing);

    // 螺旋桨
    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;
   
    // 创建螺旋桨的桨叶
    this.blade.position.set(8, 0, 0);
    this.blade.castShadow = true;
    this.blade.receiveShadow = true;
    this.propeller.add(this.blade);
    this.propeller.position.set(50, 0, 0);
    this.add(this.propeller);

    this.scale.set(.25, .25, .25);
    this.position.y = 100;
    this.position.x = -200;

    // 用键位控制移动
    window.addEventListener('keydown', evt => (typeof this.pressDirectionKeys[evt.code] !== 'boolean') || (this.pressDirectionKeys[evt.code] = true));
    window.addEventListener('keyup', evt => (typeof this.pressDirectionKeys[evt.code] !== 'boolean') || (this.pressDirectionKeys[evt.code] = false));

    loop(this.update);
  }

  private update = (time: number) => {
    let xshift = 0;
    let zshift = 0;

    // 计算最终旋转角度
    let xrotation = 0;

    if (this.pressDirectionKeys[DirectionKeys.UP]) {
      xshift += this.speed;
    }

    if (this.pressDirectionKeys[DirectionKeys.DOWN]) {
      xshift -= this.speed;
    }

    if (this.pressDirectionKeys[DirectionKeys.RIGHT]) {
      zshift += this.speed;
      xrotation += this.maxRoatation;
    }

    if (this.pressDirectionKeys[DirectionKeys.LEFT]) {
      zshift -= this.speed;
      xrotation -= this.maxRoatation;
    }

    // 移动
    this.position.z += zshift;
    this.position.x += xshift;

    // 旋转直到到达指定角度
    if (this.rotation.x > xrotation) {
      this.rotation.x -= this.rotateSpeed;
    }

    if (this.rotation.x < xrotation) {
      this.rotation.x += this.rotateSpeed;
    }

    this.propeller.rotation.x += 0.3;
  }

  // 弱智版碰撞检测
  public isCollided(target: THREE.Object3D, limit: number) {
    const distance = this.position.clone().sub(target.position.clone()).length();
    return distance <= limit;
  }
}

const airplane = new AirPlane();

export default airplane;
