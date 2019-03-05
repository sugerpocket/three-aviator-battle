import { Object3D, Mesh, MeshPhongMaterial, BoxGeometry, Vector3, SphereGeometry, ShaderMaterial } from 'three';
import Colors from '../colors';
import { loop } from '../loop';
import game from '../game';
import Bullet from './bullet';
import boss from './boss';

enum ControlKeys {
  UP = 'KeyW',
  LEFT = 'KeyA',
  DOWN = 'KeyS',
  RIGHT = 'KeyD',
  SHOT = 'Space',
}
class AirPlane extends Object3D {

  // 创建机舱
  private cockpit = new Mesh(
    new BoxGeometry(60, 50, 50, 1, 1, 1),
    new MeshPhongMaterial({
      color: Colors.Red,
      flatShading: true,
      fog: true,
    }),
  );

  // 创建引擎
  private engine = new Mesh(
    new BoxGeometry(20, 50, 50, 1, 1, 1),
    new MeshPhongMaterial({
      color: Colors.White,
      flatShading: true,
    }),
  );

  // 创建机尾
  private tail = new Mesh(
    new BoxGeometry(15, 20, 5, 1, 1, 1),
    new MeshPhongMaterial({
      color: Colors.Red,
      flatShading: true,
    }),
  );

  private wing = new Mesh(
    new BoxGeometry(40, 8, 150, 1, 1, 1),
    new MeshPhongMaterial({
      color: Colors.Red,
      flatShading: true,
    }),
  );

  private propeller = new Mesh(
    new BoxGeometry(20, 10, 10, 1, 1, 1),
    new MeshPhongMaterial({
      color: Colors.Brown,
      flatShading: true,
    }),
  );

  private blade = new Mesh(
    new BoxGeometry(1, 100, 20, 1, 1, 1),
    new MeshPhongMaterial({
      color: Colors.BrownDark,
      flatShading: true,
    }),
  );

  private speed: Readonly<number> = 2;

  private bulletSpeed: Readonly<number> = 4;
  private shotInterval: Readonly<number> = 10;
  private nextShotTime: number = 0;

  private pressControlKeys: { [key: string]: boolean } = {
    [ControlKeys.UP]: false,
    [ControlKeys.LEFT]: false,
    [ControlKeys.DOWN]: false,
    [ControlKeys.RIGHT]: false,
    [ControlKeys.SHOT]: false,
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

    // 用键位控制移动 射击
    window.addEventListener('keydown', evt => (typeof this.pressControlKeys[evt.code] !== 'boolean') || (this.pressControlKeys[evt.code] = true));
    window.addEventListener('keyup', evt => (typeof this.pressControlKeys[evt.code] !== 'boolean') || (this.pressControlKeys[evt.code] = false));

    loop(this.update);
  }

  private update = (time: number) => {
    let xshift = 0;
    let zshift = 0;

    // 计算最终旋转角度
    let xrotation = 0;

    if (this.pressControlKeys[ControlKeys.UP]) {
      xshift += this.speed;
    }

    if (this.pressControlKeys[ControlKeys.DOWN]) {
      xshift -= this.speed;
    }

    if (this.pressControlKeys[ControlKeys.RIGHT]) {
      zshift += this.speed;
      xrotation += this.maxRoatation;
    }

    if (this.pressControlKeys[ControlKeys.LEFT]) {
      zshift -= this.speed;
      xrotation -= this.maxRoatation;
    }

    // 判断是否在视野范围内
    const temp = this.position.clone();
    temp.z += zshift;
    temp.x += xshift;

    // 移动
    if (Math.abs(temp.z) < game.zMax) this.position.z += zshift;
    if (Math.abs(temp.x) < game.xMax) this.position.x += xshift;

    // 旋转直到到达指定角度
    if (this.rotation.x > xrotation) {
      this.rotation.x -= this.rotateSpeed;
    }

    if (this.rotation.x < xrotation) {
      this.rotation.x += this.rotateSpeed;
    }

    this.propeller.rotation.x += 0.3;

    // 射击
    if (this.pressControlKeys[ControlKeys.SHOT] && this.nextShotTime <= 0) { // 如果按下 shot 且冷却到了
      this.shot();
      this.nextShotTime = this.shotInterval;
    } else if (this.nextShotTime > 0) { // 如果冷却时间还没到, 冷却 -1
      this.nextShotTime -= 1;
    }
  }

  private shot() {
    if (this.parent) {
      const bullet = new Bullet(this.position, Colors.Yellow, 0.25);
      bullet.onUpdate(() => {
        bullet.position.x += this.bulletSpeed;
        // 碰到 boss 子弹销毁
        if (boss.isCollided(bullet)) {
          bullet.destroy();
        }
      });
      this.parent.add(bullet);
    }
  }

  // 弱智版碰撞检测
  public isCollided(target: THREE.Object3D) {
    const distance = this.position.clone().sub(target.position.clone()).length();
    return distance <= 20;
  }
}

const airplane = new AirPlane();

export default airplane;
