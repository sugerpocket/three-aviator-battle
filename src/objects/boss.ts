import { Object3D, CylinderGeometry, Mesh, MeshPhongMaterial, Shape, Geometry, TextureLoader } from 'three';
import Colors from '../colors';

class Boss extends Object3D {

  private createCockpit() {
    const geometry = new CylinderGeometry(10, 10, 60, 6, 3);
    const material = new MeshPhongMaterial({
      color: Colors.Red,
      flatShading: true,
    });
    const cockpit = new Mesh(geometry, material);
    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    console.log(geometry.vertices);
    for (let i = 0; i < 6; i++) {
      geometry.vertices[i].x = 0;
      geometry.vertices[i].z = 0;
      geometry.vertices[i + 18].x = 0;
      geometry.vertices[i + 18].z = 0;
    }
    // geometry.vertices[5].z = 100;
    this.add(cockpit);
  }

  private createTail() {
    const leftGeometry = new CylinderGeometry(50, 50, 2, 4, 1);
    const rightGeometry = new CylinderGeometry(50, 50, 2, 4, 1);
  }

  private createWing() {
    const geometry = new CylinderGeometry(54, 54, 0.2, 6, 1);
    const material = new MeshPhongMaterial({
      color: Colors.Red,
      flatShading: true,
    });

    function setScalePos(fIndex: number, sIndex: number, scale: number) {
      vertices[fIndex].x += scale * (vertices[sIndex].x - vertices[fIndex].x);
      vertices[fIndex].z += scale * (vertices[sIndex].z - vertices[fIndex].z);
    }

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

  constructor() {
    super();

    this.createCockpit();
    this.createWing();

  }
}

const boss = new Boss();

boss.position.set(0, 100, 0);

export default boss;