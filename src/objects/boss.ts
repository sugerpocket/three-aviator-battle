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
    const geometry = new CylinderGeometry(54, 54, 2, 6, 1);
    const material = new MeshPhongMaterial({
      color: Colors.Red,
      flatShading: true,
    });
    // geometry.vertices[3].x = 13;
    // geometry.vertices[7].x = 13;
    // geometry.vertices[8].x = 13;
    // geometry.vertices[9].x = 13;
    const wing = new Mesh(geometry, material);
    wing.castShadow = true;
    wing.receiveShadow = true;
    wing.rotateZ(Math.PI / 2);
    wing.rotateY(Math.PI / 6);
    wing.position.y = -21;
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