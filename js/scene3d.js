import THREE from 'three';
import './lib/OrbitControls';

const {
  degToRad,
  radToDeg,
} = THREE.Math;

export default function init() {
  const scene = new THREE.Scene();
  const initialRatio = 300 / 1500;
  const prev = 1000;

  const renderer = new THREE.WebGLRenderer({ autoClear: true, antialias: true, alpha: true });
  // renderer.setClearColor(0xaa0033, 1);
  // renderer.setClearColor(0xaa0033, 1);
  renderer.setClearColor(0xffffff, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.soft = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // renderer.sortObjects = true; -> possibly necessary for transparent textures

  const camera = new THREE.PerspectiveCamera(50, 1, 1, 10000);
  camera.position.z = 1500;
  camera.position.x = 0;
  camera.position.y = 300;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

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
    new THREE.PlaneGeometry(1000, 1000, 10, 10),
    // new THREE.BoxGeometry(500, 500, 500),
    new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
  );
  // const world = new THREE.Object3D();
  world.rotation.x -= Math.PI / 2;
  // world.rotation.x += Math.PI / 2;
  // world.rotation.x += Math.PI;

  world.material.side = THREE.DoubleSide;
  world.position.y = 50;
  world.position.z = 50;
  world.receiveShadow = true;
  scene.add(world);

  const light = new THREE.HemisphereLight(0xffffff, 0x000000, 0.6);
  scene.add(light);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  // controls.keys = {};
  controls.addEventListener('change', () => {
    console.log(camera.position);
    render();
  });


  function resize(width, height) {
    /*
      tan = opp / adj
      tan = Y / Z

      Y = Z * tan(vof) -> height
      Z = Y / tan(vof) -> distance
    */
    const aspect = width / height;
    const radVFOV = degToRad(camera.fov);
    const tanVFOV = Math.tan(radVFOV / 2);

    // get width and height of scene
    const h = 2 * tanVFOV * camera.position.z;
    const w = h * aspect;

    // dist = height / 2 / tan;
    // 4 = 24 / 3 / 2
    // 24 = 4 * 3 * 2

    // calculate maximal scale
    const scale = w / 1000;
    const h2 = h / scale;
    const dist = h2 / 2 / tanVFOV;
    // const dist = camera.position.z;

    console.log('window', width, height);
    console.log('scene', w, h);
    console.log('scale', scale);
    console.log('dist', dist);

    camera.position.z = dist + (1000 / 2 / scale);
    // camera.position.z = dist - 500;
    camera.position.y = camera.position.z * initialRatio;
    // camera.position.z = dist;
    // camera.position.y = dist * initialRatio;

    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    render();
  }


  function render() {
    const vFOV = camera.fov * (Math.PI / 180); // convert vertical fov to radians
    const vHeight = 2 * Math.tan(vFOV / 2) * (camera.position.z - 500); // visible height
    const vWidth = vHeight * camera.aspect; // visible width

    // console.log('W', vWidth, window.innerWidth);
    // console.log('H', vHeight, window.innerHeight);

    const opposite = camera.position.y;
    const adjacent = camera.position.z;
    const ratio = opposite / adjacent;
    // console.log(opposite, adjacent);
    // console.log(ratio, Math.tan(THREE.Math.degToRad(50)));
    // console.log(ratio, initialRatio);

    // console.log('--');

    renderer.render(scene, camera);
  }


  return {
    render,
    resize,
    domElement: renderer.domElement,
  };
}
