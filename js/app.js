import createScene3D from './scene3d';

window.onload = () => {
  const scene3d = createScene3D();
  document.body.appendChild(scene3d.domElement);
  scene3d.resize(window.innerWidth, window.innerHeight);
  window.onresize = () => {
    scene3d.resize(window.innerWidth, window.innerHeight);
  };
  // console.log(window.clientInformation);
};
