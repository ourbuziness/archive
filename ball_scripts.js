v0_x = 20; //initial velocity
v0_y = 5;
v0_z = 20;
w_x = 3 * Math.PI; // initial angular velocity
w_y = 2 * Math.PI;
w_z = 2 * Math.PI;
m = 0.5; //weight
rho = 1.2; // air density
g = 9.8; // gravity 
f = 10; //frequency of the rotation of the ball
cl = 1.23; //horizontal tension coefficient
cd = 0.5; //air resistance coefficient
D = 0.22; // diameter of the ball
A = Math.PI * Math.pow((0.5 * D), 2); //cross-sectional area of the ball
t_step = 1 / 60;
b = (1 / 2) * cd * rho * A; //for convenience
c = cl * rho * Math.pow(D, 3) * f; // for convenience
vt_x = v0_x
vt_y = v0_y
vt_z = v0_z

animateKick = function() {
  if (ball.position.y < 0) {
    return;
  }
  tmp_1 = c * Math.pow(Math.pow(vt_x, 2) + Math.pow(vt_z, 2) + Math.pow(vt_y, 2), 2)

  tmp_2 = (Math.sqrt(Math.pow(w_z * vt_y - w_y * vt_z, 2) + Math.pow(w_y * vt_x - w_x * vt_y, 2) + Math.pow(w_x * vt_z - w_z * vt_x, 2)))

  tmp = tmp_1 / tmp_2

  Fl_x = tmp * (w_z * vt_y - w_y * vt_z)

  Fl_z = tmp * (w_y * vt_x - w_x * vt_y)

  Fl_y = tmp * (w_x * vt_z - w_z * vt_y)

  //Motion differential equation
  a_x = -(b / m) * Math.sqrt((Math.pow(vt_z, 2) + Math.pow(vt_y, 2) + Math.pow(vt_x, 2))) * vt_x + (Fl_x / m)
  a_z = -(b / m) * Math.sqrt((Math.pow(vt_z, 2) + Math.pow(vt_y, 2) + Math.pow(vt_x, 2))) * vt_z + (Fl_z / m)
  a_y = -g - (b / m) * Math.sqrt((Math.pow(vt_z, 2) + Math.pow(vt_y, 2) + Math.pow(vt_x, 2))) * vt_y + (Fl_y / m)

  //use formula : s_t = s_0 + v_0 * t to update the position
  ball.position.x = ball.position.x + vt_x * t_step
  ball.position.z = ball.position.z + vt_z * t_step
  ball.position.y = ball.position.y + vt_y * t_step

  //use formula : v_t = a * t to update the velocity 
  vt_x = vt_x + a_x * t_step
  vt_z = vt_z + a_z * t_step
  vt_y = vt_y + a_y * t_step

}

window.onload = (function() {
  gWidth = window.innerWidth;
  gHeight = window.innerHeight;
  ratio = gWidth / gHeight;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeaeaea);
  camera = new THREE.PerspectiveCamera(35, ratio, 0.1, 1000);
  camera.position.z = -15;
  light = new THREE.SpotLight(0xffffff, 1);
  light.castShadow = true;
  light.position.set(0, 5, -10);
  scene.add(light);

  renderer = new THREE.WebGLRenderer();

  //properties for casting shadow
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.setSize(gWidth, gHeight);
  document.body.appendChild(renderer.domElement);

  geometry = new THREE.SphereGeometry(D, 8, 8);
  //make a checkerboard texture for the ball...
  canv = document.createElement('canvas')
  canv.width = canv.height = 256;
  ctx = canv.getContext('2d')
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = 'black';

  for (y = 0; y < 16; y++)
    for (x = 0; x < 16; x++)
      if ((x & 1) != (y & 1)) ctx.fillRect(x * 16, y * 16, 16, 16);
  ballTex = new THREE.Texture(canv);
  ballTex.needsUpdate = true;

  material = new THREE.MeshLambertMaterial({
    map: ballTex
  });
  ball = new THREE.Mesh(geometry, material);

  ball.castShadow = true;
  ball.receiveShadow = false;

  ball.bottom = D / 2;
  scene.add(ball);
  camera.lookAt(ball.position);

  plane_geometry = new THREE.PlaneGeometry(20, 100, 32);
  plane_material = new THREE.MeshBasicMaterial({
    color: 'green',
    side: THREE.DoubleSide
  });
  ground_plane = new THREE.Mesh(plane_geometry, plane_material);
  ground_plane.rotation.x = 0.5 * Math.PI
  ground_plane.position.y = -1
  ground_plane.position.z = 20
  scene.add(ground_plane);

  render = function(params) {
    animateKick();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  render();
})
