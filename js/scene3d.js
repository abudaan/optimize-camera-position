import THREE from 'three';
import './lib/OrbitControls';

const degToRad = THREE.Math.degToRad;
const radToDeg = THREE.Math.radToDeg;

export default function init() {
  const scene = new THREE.Scene();
  const initialRatio = 300 / 1500;

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
    const vFOVRadians = THREE.Math.degToRad(camera.fov);
    const tan = Math.tan(vFOVRadians / 2);
    const h = 2 * tan * (camera.position.z);
    console.log('vis h', h);
    console.log('ratio', camera.position.y / camera.position.z);

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
    const vFOV = degToRad(camera.fov);
    const hFOV = 2 * Math.atan(Math.tan(vFOV / 2) * aspect);
    const tan = Math.tan(vFOV / 2);

    // get height
    const a = 2 * tan * camera.position.z;
    // check height by calculating the fov based on this height
    const b = Math.atan((a / 2) / camera.position.z);
    // console.log(camera.fov, a, radToDeg(b));

    // const h = height;
    // const vFOV = camera.fov;
    // const a = Math.tan(vFOV / 2);
    // const distance = h / a / 2;
    // console.log(h, vFOV, distance);
    // const focalLength = 25.734; // equivalent to FOV=50
    // const distance = 1000 / Math.tan(camera.fov / focalLength);

    // console.log(distance);


    // const vWidth = width;
    // const vHeight = width / aspect;
    const dist1 = height / 2 / (Math.tan(vFOV / 2));
    const dist2 = width / 2 / (Math.tan(hFOV / 2));
    // const dist = width > height ? dist1 : dist2;
    // console.log(dist1, dist2, width, height);
    // const dist = Math.max(dist2, dist1);
    // const dist = dist1;
    // console.log(width / height, dist);

    // fov = 2 * Math.atan( ( width / aspect ) / ( 2 * dist ) ) * ( 180 / Math.PI );

    // camera.fov / 2 = (Math.atan(height / (2 * dist))); // * ( 180 / Math.PI );

    // THREE.Math.radToDeg((Math.atan(height / (2 * dist)))) = 25

    // const vHeight = height;
    // const vHeight = width / aspect;
    // const dist = vHeight / 2 / (Math.tan(vFOV / 2));


    // const dist = Math.abs(width * Math.sin(THREE.Math.degToRad(camera.fov / 2)));

    // console.log(vHeight, vWidth, dist);
    // console.log(dist, camera.position);


    // const dist = Math.abs(1000 / Math.sin(vFOV / 2));
    // const h = 2 * tan * (camera.position.z);
    const h = 2 * tan * 1353.7499999999995;
    console.log(h);

    const w = h * aspect;
    // console.log(width, height * aspect);
    // console.log(h * aspect, h);
    // console.log(width, height);
    const scale = w / 1000;
    const h2 = scale * h;
    const dist = h2 / 2 / tan;

    // console.log(width, height);
    // console.log(scale);


    // camera.position.z = dist;
    // camera.position.y = camera.position.z * initialRatio;

    // console.log(camera.position.z);


    // camera.position.z = distance;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    // console.log(camera.projectionMatrix);
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
