import createScene3D from './scene3d';

let scene3d;

const resize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  scene3d.resize(width, height);
};

window.onload = () => {
  scene3d = createScene3D();
  document.body.appendChild(scene3d.domElement);
  resize();
  window.onresize = resize;
};
