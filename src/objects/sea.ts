import { CylinderGeometry, Matrix4, MeshPhongMaterial, Mesh } from 'three';
import Colors from '../colors';
import { loop } from '../loop';

interface Wave {
  y: number;
  x: number;
  z: number;
  // 随机距离
  amp: number;
  // 随机角度
  angle: number;
  // 在0.016至0.048度/帧之间的随机速度
  speed: number;
}

// 创建一个圆柱几何体
// 参数为：顶面半径，底面半径，高度，半径分段，高度分段
const geometry = new CylinderGeometry(1400, 1400, 1200, 100, 10);

// 在 x 轴旋转几何体
geometry.applyMatrix(new Matrix4().makeRotationX(-Math.PI / 2));
// 重点：通过合并顶点，我们确保海浪的连续性
geometry.mergeVertices();

// 创建材质
const material = new MeshPhongMaterial({
  color: Colors.Blue,
  transparent: true,
  opacity: .6,
  flatShading: true,
});

// 获得顶点
var length = geometry.vertices.length;

// 创建一个新的数组存储与每个顶点关联的值：
const waves: Wave[] = [];

for (let i = 0; i < length; i++){
  // 获取每个顶点
  const v = geometry.vertices[i];

  // 存储一些关联的数值
  waves.push({
    y: v.y,
    x: v.x,
    z: v.z,
    // 随机距离
    amp: 5 + Math.random() * 15,
    // 随机角度
    angle: Math.random() * Math.PI * 2,
    // 在0.016至0.048度/帧之间的随机速度
    speed: 0.016 + Math.random() * 0.032,
  });
};

// 为了在 js 创建一个物体，我们必须创建网格用来组合几何体和一些材质
const sea = new Mesh(geometry, material);

// 允许大海对象接收阴影
sea.receiveShadow = true;
sea.castShadow = true;

sea.position.y = -1400;

// 启动波浪循环
loop(time => {
  // 获取顶点
  const { vertices } = geometry;
  const { length } = vertices;

  for (let i = 0; i < length; i++){
    const v = vertices[i];
    // 获取关联的值
    const vprops = waves[i];

    // 更新顶点的位置
    v.x = vprops.x + Math.cos(vprops.angle) * vprops.amp;
    v.y = vprops.y + Math.sin(vprops.angle) * vprops.amp;
    v.z = vprops.z + Math.cos(vprops.angle) * vprops.amp;

    // 下一帧自增一个角度
    vprops.angle += vprops.speed;
  }

  // 告诉渲染器代表大海的几何体发生改变
  // 事实上，为了维持最好的性能
  // js 会缓存几何体和忽略一些修改
  // 除非加上这句
  geometry.verticesNeedUpdate = true;

  // 大海转动
  sea.rotation.z += .005;
});

export default sea;
