import THREE from 'three';
import './lib/OrbitControls';

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
    // console.log(camera.position, camera.fov);
    render();
  });


  function resize(width, height) {
    // console.log(width,height);
    // const distance;
    // const height = 2 * Math.tan( ( vFOV / 2 ) ) * distance;
    // const vFOV = 2 * Math.atan(height / (2 * distance));
    // const d = 4;
    // const f = 3
    // const h = 2 * f * d; // 24
    // console.log(24 / 3 / 2);

    // const h = height;
    // const vFOV = camera.fov;
    // const a = Math.tan(vFOV / 2);
    // const distance = h / a / 2;
    // console.log(h, vFOV, distance);
    // const focalLength = 25.734; // equivalent to FOV=50
    // const distance = 1000 / Math.tan(camera.fov / focalLength);

    // console.log(distance);

    /*
    tan = opp / adj
    tan = y / z
    z = y / tan
    y = z * tan


    */

    const aspect = width / height;
    // const vFOV = THREE.Math.radToDeg(2 * Math.atan(Math.tan(THREE.Math.degToRad(camera.fov) * 0.5) / camera.zoom));
    // console.log(vFOV, camera.fov);
    const vFOV = THREE.Math.degToRad(camera.fov);
    const hFOV = 2 * Math.atan(Math.tan(vFOV / 2) * aspect);


    // const vWidth = width;
    // const vHeight = width / aspect;
    const dist1 = height / 2 / (Math.tan(vFOV / 2));
    const dist2 = height / 2 / (Math.tan(hFOV / 2));
    const dist = width > height ? dist2 : dist1;

    // fov = 2 * Math.atan( ( width / aspect ) / ( 2 * dist ) ) * ( 180 / Math.PI );

    // camera.fov / 2 = (Math.atan(height / (2 * dist))); // * ( 180 / Math.PI );

    // THREE.Math.radToDeg((Math.atan(height / (2 * dist)))) = 25

    // const vHeight = height;
    // const vHeight = width / aspect;
    // const dist = vHeight / 2 / (Math.tan(vFOV / 2));


    // const dist = Math.abs(width * Math.sin(THREE.Math.degToRad(camera.fov / 2)));

    // console.log(vHeight, vWidth, dist);
    console.log(dist, camera.position);
    camera.position.z = dist + 500;
    camera.position.y = camera.position.z * initialRatio;


    // camera.position.z = distance;
    camera.aspect = width / height;
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
