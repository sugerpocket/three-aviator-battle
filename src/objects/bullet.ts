import { Mesh, TetrahedronGeometry, MeshPhongMaterial, Vector3, Object3D, Color } from 'three';
import { loop, cancelLoop } from '../loop';
import { TweenMax, Power2 } from 'gsap';
import game from '../game';

class BulletParticle extends Mesh {
  constructor(position: Vector3, color: Color, scale: number) {
    super(
      new TetrahedronGeometry(3, 0),
      new MeshPhongMaterial({
        color,
        shininess: 0,
        specular: 0xffffff,
        flatShading: true,
      }),
    );
    this.position.set(position.x, position.y, position.z);
    this.scale.set(scale, scale, scale);
  }

  public explode() {
    let material = this.material as MeshPhongMaterial;
    material.needsUpdate = true;
    const targetX = this.position.x + (-1 + Math.random() * 2) * 20;
    const targetZ = this.position.z + (-1 + Math.random() * 2) * 20;
    const speed = .6 + Math.random() * .2;
    TweenMax.to(this.rotation, speed, { x: Math.random() * 12, z: Math.random() * 12 });
    TweenMax.to(this.scale, speed, { x: .1, y: .1, z: .1 });
    TweenMax.to(this.position, speed, { x: targetX, z: targetZ, delay: Math.random() * .1, ease: Power2.easeOut, onComplete: () => {
      if(this.parent) this.parent.remove(this);
      this.scale.set(1, 1, 1);
    }});
  }
}

type DestroyCallback = () => void;

export default class Bullet extends Mesh {
  private destroyCallbacks: DestroyCallback[] = [];
  private updateCallbacks: FrameRequestCallback[] = [];

  private loopFlag: number | null = null;

  private size = .35;

  constructor(position: Vector3, color: number, scale: number) {
    super(
      new TetrahedronGeometry(8, 2),
      new MeshPhongMaterial({
        color: color,
        shininess: 0,
        specular: 0xffffff,
        flatShading: true,
      }),
    );

    this.castShadow = true;

    this.position.set(position.x, position.y, position.z);

    this.size = scale;
    this.scale.set(this.size, this.size, this.size);

    this.loopFlag = loop(this.update);
  }

  private update = (time: number) => {
    this.rotation.z += Math.random() * .1;
    this.rotation.y += Math.random() * .1;

    this.updateCallbacks.forEach(cb => cb(time));
    
    // 超出范围 +50 移除子弹 
    const xmax = game.xMax + 50;
    const zmax = game.zMax + 50;

    if (this.position.x > xmax || this.position.x < -xmax || this.position.z > zmax || this.position.z < -zmax) {
      this.drop();
    }
  }

  // 爆炸特效
  private explode() {
    const n = 15;
    this.visible = false;
    for (let i = 0; i < n; i++) {
      const particle = new BulletParticle(this.position, (this.material as MeshPhongMaterial).color, this.size * 2);
      (this.parent as Object3D).add(particle);
      particle.visible = true;
      particle.explode();
    }
  }

  public drop() {
    if (this.parent) this.parent.remove(this);
    this.destroyCallbacks.forEach(cb => cb());
    // 防止内存泄漏
    if (this.loopFlag) cancelLoop(this.loopFlag);
  }

  public destroy() {
    this.explode();
    this.drop();
  }

  public onUpdate(callback: FrameRequestCallback) {
    this.updateCallbacks.push(callback);
  }

  public onDestroy(callback: DestroyCallback) {
    this.destroyCallbacks.push(callback);
  }
}