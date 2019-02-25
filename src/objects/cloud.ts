import * as THREE from 'three';
import Colors from '../colors';

export default class Cloud extends THREE.Object3D {
  // 创建材质；一个简单的白色材质就可以达到效果
  private material = new THREE.MeshPhongMaterial({
    color: Colors.White,  
  });

  // 创建一个正方体
  // 这个形状会被复制创建云
  private geometry = new THREE.BoxGeometry(20, 20, 20);

  constructor() {
    super();

    // 云朵由随机 4-9 个方块生成
    const n = 4 + Math.floor(Math.random() * 6);

    for (var i = 0; i < n; i++){
    
      // 通过复制几何体创建网格
      const mesh = new THREE.Mesh(this.geometry, this.material); 
      
      // 随机设置每个正方体的位置和旋转角度
      if (i % 2 === 0) {
        mesh.position.x = i / 2 * 15 - n * 15;
        mesh.position.y = Math.random() * 10;
        mesh.position.z = Math.random() * 10;
        mesh.rotation.z = Math.random() * Math.PI * 2;
        mesh.rotation.y = Math.random() * Math.PI * 2;
      } else {
        mesh.position.z = i / 2 * 15 - n * 15;
        mesh.position.y = Math.random() * 10;
        mesh.position.x = Math.random() * 10;
        mesh.rotation.x = Math.random() * Math.PI * 2;
        mesh.rotation.y = Math.random() * Math.PI * 2;
      }
   
      // 随机设置正方体的大小
      const size = .1 + Math.random() * .9;
      mesh.scale.set(size, size, size);
   
      // 允许每个正方体生成投影和接收阴影
      mesh.castShadow = true;
      mesh.receiveShadow = true;
   
      // 将正方体添加至开始时我们创建的容器中
      this.add(mesh);
    } 
  }
}
