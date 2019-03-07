import { Object3D, CylinderGeometry, Mesh, MeshPhongMaterial, PlaneGeometry, SphereGeometry, Vector3 } from 'three';
import Colors from '../colors';
import Bullet from './bullet';
import { loop, cancelLoop } from '../loop';
import game from '../game';
import airplane from './airplane';

class Boss extends Object3D {
  private actionLock: boolean = false;
  // 机身
  private body = new Mesh(
    new CylinderGeometry(10, 10, 60, 6, 3),
    new MeshPhongMaterial({
      color: Colors.Red,
      flatShading: true,
    }),
  );

  private createBody() {
    this.body.castShadow = true;
    this.body.receiveShadow = true;

    const { vertices } = this.body.geometry as CylinderGeometry;

    for (let i = 0; i < 6; i++) {
      vertices[i].x = 0;
      vertices[i].z = 0;
      if (i % 3 === 0) {
        vertices[i + 6].z = vertices[i + 6].z * 1.2;
        vertices[i + 12].z = vertices[i + 12].z * 0.9;
      } else {
        vertices[i + 6].z = vertices[i + 6].z * 1.6;
        vertices[i + 12].z = vertices[i + 12].z * 1.2;
      }
      vertices[i + 12].x = vertices[i + 12].x * 0.8;
      vertices[i + 18].x = 0.5 * vertices[i + 18].x;
      vertices[i + 18].z = 0.5 * vertices[i + 18].z;
      vertices[i + 18].y = -10;
    }

    this.add(this.body);
  }

  // 尾翼
  private tail = new Object3D();
  private createTail() {
    const width = 10;
    const height = 14;
    const geometry = new PlaneGeometry(width, height, 1, 1);
    const material = new MeshPhongMaterial({
      color: Colors.Red,
      flatShading: true,
    });

    const left = new Mesh(geometry.clone(), material.clone());
    const right = new Mesh(geometry.clone(), material.clone());

    this.tail.castShadow = left.castShadow = right.castShadow = true;
    this.tail.receiveShadow = left.receiveShadow = right.receiveShadow = true;

    left.position.y = -10 + height / 2;
    right.position.y = -10 + height / 2;
    left.position.x = width / 2;
    right.position.x = width / 2;
    left.position.z = 6;
    right.position.z = -6;

    left.rotateX(Math.PI / 36);
    right.rotateX(-Math.PI / 36);

    left.rotateY(-Math.PI / 6);
    right.rotateY(Math.PI / 6);

    this.tail.add(left, right);

    this.add(this.tail);
  }

  // 机舱
  private cabin = new Mesh(
    new SphereGeometry(5, 5, 5),
    new MeshPhongMaterial({
      color: Colors.Blue,
      flatShading: true,
    }),
  );
  private createCabin() {

    this.cabin.position.y = 3;
    this.cabin.position.x = 8;

    this.add(this.cabin);
  }

  // 机翼
  private wing = new Mesh(
    new CylinderGeometry(54, 54, 0.2, 6, 1),
    new MeshPhongMaterial({
      color: Colors.Red,
      flatShading: true,
    })
  );
  private createWing() {

    const { vertices } = this.wing.geometry as CylinderGeometry;
    vertices[4].x += 0.64 * (vertices[1].x - vertices[4].x);
    vertices[4].z += 0.64 * (vertices[1].z - vertices[4].z);
    vertices[10].x += 0.64 * (vertices[7].x - vertices[10].x);
    vertices[10].z += 0.64 * (vertices[7].z - vertices[10].z);
    vertices[12].x = vertices[4].x;
    vertices[13].x = vertices[10].x;
    vertices[12].z = vertices[4].z;
    vertices[13].z = vertices[10].z;

    vertices[5].x += 0.7 * (vertices[0].x - vertices[5].x);
    vertices[5].z += 0.7 * (vertices[0].z - vertices[5].z);
    vertices[11].x += 0.7 * (vertices[6].x - vertices[11].x);
    vertices[11].z += 0.7 * (vertices[6].z - vertices[11].z);

    vertices[3].x += 0.7 * (vertices[2].x - vertices[3].x);
    vertices[3].z += 0.7 * (vertices[2].z - vertices[3].z);
    vertices[9].x += 0.7 * (vertices[8].x - vertices[9].x);
    vertices[9].z += 0.7 * (vertices[8].z - vertices[9].z);

    this.wing.castShadow = true;
    this.wing.receiveShadow = true;
    this.wing.rotateZ(Math.PI / 2);
    this.wing.rotateY(Math.PI / 6);
    this.wing.position.y = -24;
    

    this.add(this.wing);
  }

  // 机炮
  private cannons = new Object3D();
  private createCannons() {
    const zshift = 20;
    const yshift = 5;
    const geometry = new CylinderGeometry(4, 0, 30, 6);
    const material = new MeshPhongMaterial({
      color: Colors.Red,
      flatShading: true,
    });

    const left = new Mesh(geometry, material);
    const right = new Mesh(geometry, material);
    
    left.position.z += zshift;
    right.position.z -= zshift;
    left.position.y += yshift;
    right.position.y += yshift;

    this.cannons.add(left, right);
    this.add(this.cannons);
  }

  private getCannonPosition(pos: 'left' | 'right') {
    const index = pos === 'left' ? 0 : 1;
    const cannon = this.cannons.children[index] as Mesh;
    this.updateMatrixWorld(true);
    const { vertices } = cannon.geometry as CylinderGeometry;
    const v = (new Vector3()).setFromMatrixPosition(cannon.matrixWorld);
    v.x += vertices[6].y;
    return v;
  }

  constructor() {
    super();

    this.createBody();
    this.createWing();
    this.createTail();
    this.createCabin();
    this.createCannons();

    loop(this.update);
  }

  private cd(frame: number) {
    return new Promise(resolve => {
      const flag = loop(() => --frame <= 0 && (cancelLoop(flag), resolve(frame)));
    });
  }

  private shot(angle: number, speed: number, cannon: 'left' | 'right') {
    if (this.parent) {
      const position = this.getCannonPosition(cannon);

      const bullet = new Bullet(position, Colors.Red, 0.3);

      const xspeed = -speed * Math.cos(angle);
      const zspeed = speed * Math.sin(angle);
      bullet.onUpdate(() => {
        bullet.position.x += xspeed;
        bullet.position.z += zspeed;
      });

      this.parent.add(bullet);
    }
  }

  /**
   * 指定目标地点进行移动
   * @param x {string} 目的 x 坐标
   * @param z {number} 目的 z 坐标
   * @param speed {number} 每帧移动的距离
   */
  private moveTo(x: number, z: number, speed: number) {
    return new Promise((resolve, reject) => {
      if (!game) {
        return reject('game not start');
      }
      if (Math.abs(x) > game.xMax || Math.abs(z) > game.zMax) {
        console.log('out of boundary');
      }
      const xshift = x - this.position.x;
      const zshift = z - this.position.z;
      if (xshift === 0 && zshift === 0) {
        return resolve();
      }

      const xspeed = (speed * xshift) / (Math.abs(xshift) + Math.abs(zshift));
      const zspeed = (speed * zshift) / (Math.abs(xshift) + Math.abs(zshift));

      let xCurShift = 0;
      let zCurShift = 0;

      const flag = loop(() => {
        xCurShift += xspeed;
        zCurShift += zspeed;

        this.position.x += xspeed;
        this.position.z += zspeed;

        if (Math.abs(xCurShift) >= Math.abs(xshift) && Math.abs(zCurShift) >= Math.abs(zshift)) {
          cancelLoop(flag);
          resolve();
        }
      });
    });
  }

  /**
   * 
   * @param x {number} 目标点 x 坐标
   * @param z {number} 目标点 y 坐标
   * @param cannon {'left' | 'right'} 哪个炮管发射
   */
  private shotTo(x: number, z: number, cannon: 'left' | 'right') {
    const position = this.getCannonPosition(cannon);
    const xshift = x - position.x;
    const zshift = z - position.z;

    this.shot(Math.atan(-zshift / xshift), 10, cannon);
  }

  // 三种技能
  /**
   * 平移扫射
   */
  private async directShot() {
    let time = 0;
    const shotInterval = 10;
    const flag = loop(() => {
      time %= shotInterval;
      if (time === 0) {
        this.shot(0, 10, 'left');
        this.shot(0, 10, 'right');
      }
      time++;
    });
    await this.moveTo(game.xMax / 2, game.zMax - 1, 5);
    await this.moveTo(game.xMax / 2, -game.zMax + 1, 5);
    await this.moveTo(game.xMax / 2, 0, 5);
    cancelLoop(flag);
  }

  /**
   * 随机移动到6个点进行点射
   */
  private async fixedShot() {
    for (let i = 0; i < 3; i++) {
      const x = Math.random() * game.xMax;
      const z = (0.5 - Math.random()) * game.zMax;
      await this.moveTo(x, z, 10);
      this.shotTo(airplane.position.x, airplane.position.z, 'left');
      this.shotTo(airplane.position.x, airplane.position.z, 'right');
      await this.cd(4);
      this.shotTo(airplane.position.x, airplane.position.z, 'left');
      this.shotTo(airplane.position.x, airplane.position.z, 'right');
      await this.cd(4);
      this.shotTo(airplane.position.x, airplane.position.z, 'left');
      this.shotTo(airplane.position.x, airplane.position.z, 'right');
      await this.cd(20);
    }
  }

  /**
   * 随机移动到某点进行散射
   */
  private async scatterShot() {
    for (let i = 0; i < 3; i++) {
      const x = Math.random() * game.xMax;
      const z = (0.5 - Math.random()) * game.zMax;
      await this.moveTo(x, z, 5);
      for (let j = 0; j < 3; j++) {
        const angleShift = (1 - j) * (Math.PI / 9);
        this.shot(0 + angleShift, 10, 'left');
        this.shot(0 + angleShift, 10, 'right');
        this.shot(Math.PI / 4 + angleShift, 10, 'left');
        this.shot(Math.PI / 4 + angleShift, 10, 'right');
        this.shot(-Math.PI / 4 + angleShift, 10, 'left');
        this.shot(-Math.PI / 4 + angleShift, 10, 'right');
        await this.cd(10);
      }
      await this.cd(60);
    }
  }

  private update = async () => {
    if (!this.actionLock) {
      this.actionLock = true;
      const action = Math.floor(Math.random() * 3) % 3;
      try {
        switch (action) {
          case 0: await this.directShot(); break;
          case 1: await this.fixedShot(); break;
          case 2: await this.scatterShot(); break;
        }
        await this.moveTo(game.xMax / 2, 0, 2);
      } finally {
        await this.cd(240);
        this.actionLock = false;
      }
    }
  }

  // 弱智版碰撞检测
  public isCollided(target: THREE.Object3D) {
    const distance = this.position.clone().sub(target.position.clone()).length();
    return distance <= 40;
  }
}

const boss = new Boss();

boss.rotateZ(Math.PI / 2);

export default boss;