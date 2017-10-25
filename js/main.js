var scene;
var camera;
var renderer;
var stats;
var container;

var axis;
var plane;
var ground;

var wireframe;

var select;

var directionalLight;

window.onload = function () {
  container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);

  controls = new THREE.OrbitControls(camera);

  renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

  stats = new Stats();
  container.appendChild(stats.dom);

  directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(0, 3, 1);
  scene.add(directionalLight);

  var geometry = new THREE.PlaneGeometry(15, 15, 32, 32);
  var texture = THREE.ImageUtils.loadTexture('./res/jo.png');
  texture.magFilter = THREE.NearestFilter;

  var material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, flatShading: true, map: texture });
  plane = new THREE.Mesh(geometry, material);

  plane.rotation.x = -0.5 * Math.PI;
  plane.updateMatrixWorld();

  var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 6, 4),
    new THREE.MeshBasicMaterial({ color: 0xffffff, visible: false })
  );
  sphere.scale.y = 0.5;

  for (var i = 0, l = plane.geometry.vertices.length; i < l; i++) {
    var height = Math.random() / 2;
    plane.geometry.vertices[i].z = height;
  }

  scene.add(plane);

  var mat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
  wireframe = new THREE.Mesh(plane.geometry, mat);
  wireframe.rotation.x = -0.5 * Math.PI;
  wireframe.visible = false;

  scene.add(wireframe);

  select = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 8, 6),
    new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false })
  );
  select.visible = false;

  scene.add(select);

  directionalLight.target = plane;

  camera.position.x = 2.5;
  camera.position.y = 10;
  camera.position.z = 10;

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer.domElement.addEventListener('mousemove', onMouseMove, false);
  renderer.domElement.addEventListener('mousedown', onMouseDown, false);
  renderer.domElement.addEventListener('mouseup', onMouseUp, false);
  renderer.domElement.addEventListener('click', onClick, false);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  stats.begin();

  plane.geometry.verticesNeedUpdate = true;

  var scale = select.position.distanceTo( camera.position ) / 6 //* scope.size;
  //this.position.copy( worldPosition );
  select.scale.set( scale, scale, scale );

  renderer.render(scene, camera);

  stats.end();
}

function toScreenPosition(pos, camera) {
  var widthHalf = renderer.context.canvas.width / 2;
  var heightHalf = renderer.context.canvas.height / 2;

  var p = pos.clone();
  var pos = p.project(camera);

  return {
    x: (pos.x * widthHalf) + widthHalf,
    y: -(pos.y * heightHalf) + heightHalf
  };
}

function onMouseMove(e) {
  //select

  var scale = select.position.distanceTo( camera.position ) / 6 //* scope.size;
  //this.position.copy( worldPosition );
  select.scale.set( scale, scale, scale );

}

function onClick(e) {
  var min = { pos: { x: 0, y: 0, z: 0 }, dist: 100 };
  
    plane.geometry.vertices.forEach(function (element) {
      var vector = element.clone();
      vector.applyMatrix4(plane.matrixWorld);
  
      var p = toScreenPosition(vector, camera);
      var a = p.x - e.clientX;
      var b = p.y - e.clientY;
      var c = Math.sqrt(a * a + b * b);
  
      if (c < min.dist) min = { pos: vector, dist: c };
    });
  
    if (min.dist < 20) {
      select.position.x = min.pos.x;
      select.position.y = min.pos.y;
      select.position.z = min.pos.z;
      select.visible = true;
    } else {
      select.visible = false;
    }
}

function onMouseDown(e) {
  //plane.visible = false;
  //wireframe.visible = true;
}

function onMouseUp(e) {
  //plane.visible = true;
  //wireframe.visible = false;
}



/*
        scale = worldPosition.distanceTo( camPosition ) / 6 * scope.size;
        this.position.copy( worldPosition );
        this.scale.set( scale, scale, scale );
*/