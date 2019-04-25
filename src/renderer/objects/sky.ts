import { Object3D } from 'three';
import Cloud from './cloud';
import { loop } from '../loop';

class Sky extends Object3D {
  // 选取若干朵云散布在天空中
  private numberClouds = 10;

  constructor() {
    super();
    // 把云均匀地散布
    // 我们需要根据统一的角度放置它们
    const stepAngle = Math.PI * 2 / this.numberClouds;

    // 创建云对象
    for(let i = 0; i < this.numberClouds; i++){
      const cloud = new Cloud();
 
      // 设置每朵云的旋转角度和位置
      // 因此我们使用了一点三角函数
      const a = stepAngle * i; // 这是云的最终角度
      const h = 750 + Math.random() * 200; // 这是轴的中心和云本身之间的距离

      // 三角函数！！！希望你还记得数学学过的东西 :)
      // 假如你不记得: 
      // 我们简单地把极坐标转换成笛卡坐标
      cloud.position.y = Math.sin(a) * h;
      cloud.position.x = Math.cos(a) * h;

      // 根据云的位置旋转它
      cloud.rotation.z = a + Math.PI/2;

      // 为了有更好的效果，我们把云放置在场景中的随机深度位置
      cloud.position.z = 200 - Math.random() * 400;
  
      // 而且我们为每朵云设置一个随机大小
      const size = 1 + Math.random() * 2;
      cloud.scale.set(size, size, size);

      // 不要忘记将每朵云的网格添加到场景中
      this.add(cloud);
    } 
  }
}

const sky = new Sky();

sky.position.y = -600;

loop(time => sky.rotation.z += .005);

export default sky;
