import THREE from 'three';
import './lib/OrbitControls';

const {
  degToRad,
  // radToDeg,
} = THREE.Math;

// Some contants
const cameraFOV = 50;
const radVFOV = degToRad(cameraFOV);
const tanVFOV = Math.tan(radVFOV / 2);
const initialCameraZ = 1500;
const initialCameraY = 300;
const initialRatio = initialCameraY / initialCameraZ;
const objectSize = 1000;

const init = () => {
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({ autoClear: true, antialias: true, alpha: true });
  renderer.setClearColor(0xffffff, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.soft = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const camera = new THREE.PerspectiveCamera(cameraFOV, 1, 1, objectSize * 10);
  camera.position.x = 0;
  camera.position.y = initialCameraY;
  camera.position.z = initialCameraZ;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const render = () => {
    renderer.render(scene, camera);
  };

  const spot = new THREE.SpotLight(0xffffff, 1);
  spot.position.set(300, 300, 300);
  spot.target.position.set(0, 0, 0);
  spot.shadowCameraNear = 1;
  spot.shadowCameraFar = 1024;
  spot.castShadow = true;
  spot.shadowDarkness = 0.3;
  spot.shadowBias = 0.0001;
  spot.shadowMapWidth = 2048;
  spot.shadowMapHeight = 2048;
  scene.add(spot);

  const world = new THREE.Mesh(
    new THREE.PlaneGeometry(objectSize, objectSize, 10, 10),
    // new THREE.BoxGeometry(500, 500, 500),
    new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
  );
  // const world = new THREE.Object3D();
  world.rotation.x -= Math.PI / 2;
  world.material.side = THREE.DoubleSide;
  world.position.y = 50;
  world.position.z = 50;
  world.receiveShadow = true;
  scene.add(world);

  const light = new THREE.HemisphereLight(0xffffff, 0x000000, 0.6);
  scene.add(light);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', () => {
    console.log(camera.position);
    render();
  });

  /**
   * Some handy formulas:
   *
   * tan = opposite / adjacent
   * tan = Y / Z
   *
   * Y = Z * tan(vof) -> height
   * Z = Y / tan(vof) -> distance
  */
  const resize = (width, height) => {
    const aspect = width / height;

    // get width and height of scene
    const h = 2 * tanVFOV * camera.position.z;
    const w = h * aspect;

    // calculate maximal scale
    const scale = w / objectSize;
    const h2 = h / scale;
    const dist = h2 / 2 / tanVFOV;

    console.log('window', width, height);
    console.log('scene', w, h);
    console.log('scale', scale);
    console.log('dist', dist);

    camera.position.z = dist + (objectSize / 2);
    camera.position.y = camera.position.z * initialRatio;

    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    render();
  };

  return {
    domElement: renderer.domElement,
    resize,
  };
};

export default init;

