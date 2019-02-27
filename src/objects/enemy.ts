import { Mesh, TetrahedronGeometry, MeshPhongMaterial, Vector3, Object3D } from 'three';
import Colors from '../colors';
import { loop, cancelLoop } from '../loop';
import airplane from './airplane';
import { TweenMax, Power2 } from 'gsap';

class EnemyParticle extends Mesh {
  constructor(position: Vector3, color: number, scale: number) {
    super(
      new TetrahedronGeometry(3, 0),
      new MeshPhongMaterial({
        color,
        shininess: 0,
        specular: 0xffffff,
        flatShading: true,
      }),
    );
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
      // particlesPool.unshift(_this);
    }});
  }
}

type DestroyCallback = () => void;

export default class Enemy extends Mesh {
  private destroyCallbacks: DestroyCallback[] = [];

  private loopFlag: number | null = null;

  private size = .35;

  constructor() {
    super(
      new TetrahedronGeometry(8, 2),
      new MeshPhongMaterial({
        color: Colors.Red,
        shininess: 0,
        specular: 0xffffff,
        flatShading: true,
      }),
    );

    this.castShadow = true;

    this.position.y = 100;

    this.scale.set(this.size, this.size, this.size);

    this.loopFlag = loop(this.update);
  }

  private update = (time: number) => {
    this.rotation.z += Math.random() * .1;
    this.rotation.y += Math.random() * .1;

    if (airplane.isCollided(this, 20)) {
      this.destroy();
    }
  }

  // 爆炸特效
  private explode() {
    const n = 15;
    this.visible = false;
    for (let i = 0; i < n; i++){
      const particle = new EnemyParticle(this.position, Colors.Red, this.size * 2);
      (this.parent as Object3D).add(particle);
      particle.visible = true;
      particle.position.y = this.position.y;
      particle.position.x = this.position.x;
      particle.explode();
    }
  }

  private destroy() {
    this.explode();
    this.destroyCallbacks.forEach(cb => cb());
    // 防止内存泄漏
    if (this.loopFlag) cancelLoop(this.loopFlag);
  }

  public onDestroy(callback: DestroyCallback) {
    this.destroyCallbacks.push(callback);
  }
}