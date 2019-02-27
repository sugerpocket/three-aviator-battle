import { Object3D, CylinderGeometry, Mesh, MeshPhongMaterial, Shape, Geometry, TextureLoader, ColorKeywords, PlaneGeometry, SphereGeometry, Color } from 'three';
import Colors from '../colors';

class Boss extends Object3D {
  // 机身
  private createBody() {
    const geometry = new CylinderGeometry(10, 10, 60, 6, 3);
    const material = new MeshPhongMaterial({
      color: Colors.Red,
      flatShading: true,
    });
    const body = new Mesh(geometry, material);
    body.castShadow = true;
    body.receiveShadow = true;

    const { vertices } = geometry;

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
    // geometry.vertices[5].z = 100;
    this.add(body);
  }

  // 尾翼
  private createTail() {
    const height = 10;
    const width = 14;
    const geometry = new PlaneGeometry(width, height, 1, 1);
    const material = new MeshPhongMaterial({
      color: Colors.Red,
      flatShading: true,
    });

    const tail = new Object3D();

    const left = new Mesh(geometry.clone(), material.clone());
    const right = new Mesh(geometry.clone(), material.clone());

    tail.castShadow = left.castShadow = right.castShadow = true;
    tail.receiveShadow = left.receiveShadow = right.receiveShadow = true;

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

    tail.add(left, right);

    this.add(tail);
  }

  // 机舱
  private createCabin() {
    const geometry = new SphereGeometry(5, 5, 5);
    const material = new MeshPhongMaterial({
      color: Colors.Blue,
      flatShading: true,
    });


    const cabin = new Mesh(geometry, material);

    cabin.position.y = 3;
    cabin.position.x = 8;

    this.add(cabin);
  }

  // 机翼
  private createWing() {
    const geometry = new CylinderGeometry(54, 54, 0.2, 6, 1);
    const material = new MeshPhongMaterial({
      color: Colors.Red,
      flatShading: true,
    });

    const { vertices } = geometry;
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

    const wing = new Mesh(geometry, material);
    wing.castShadow = true;
    wing.receiveShadow = true;
    wing.rotateZ(Math.PI / 2);
    wing.rotateY(Math.PI / 6);
    wing.position.y = -24;
    // wing.position.y = -24;
    this.add(wing);
  }

  private createCannon() {
    // const geometry = new 
  }

  constructor() {
    super();

    this.createBody();
    this.createWing();
    this.createTail();
    this.createCabin();
    this.createCannon();
  }
}

const boss = new Boss();

boss.position.set(0, 100, 0);
boss.rotateZ(Math.PI / 2);

export default boss;