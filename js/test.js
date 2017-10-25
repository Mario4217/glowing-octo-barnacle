var renderer;
var scene;
var camera;

window.onload = function() {

  //scene
  scene = new THREE.Scene();
  //camera
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0,-12,5);
  camera.lookAt(new THREE.Vector3( 0, 5, 0 ));
   
  //renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;

  renderer.shadowMap.renderReverseSided = false;
  renderer.shadowMap.renderSingleSided = false;

  document.body.appendChild( renderer.domElement );

  var controls = new THREE.OrbitControls( camera, renderer.domElement );

  //directional light
  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(5, 0, 5);
  directionalLight.target.position.set(0, 0, 0);

  directionalLight.castShadow = true;
  directionalLight.shadowDarkness = 0.5;
  directionalLight.shadowCameraVisible = true;

  directionalLight.shadowCameraNear = 0;
  directionalLight.shadowCameraFar = 15;

  directionalLight.shadowCameraLeft = -5;
  directionalLight.shadowCameraRight = 5;
  directionalLight.shadowCameraTop = 5;
  directionalLight.shadowCameraBottom = -5;

  scene.add(directionalLight);

  var helper = new THREE.CameraHelper( directionalLight.shadow.camera );
  scene.add( helper );

  //plane
  var geometry = new THREE.PlaneGeometry(20, 10);
  var material = new THREE.MeshPhongMaterial( { color: 0xcccccc} );
  var plane = new THREE.Mesh( geometry, material );
  plane.receiveShadow = true;
  scene.add(plane);

  var terrain = [];

  var geometry = new THREE.PlaneGeometry(10, 10, 8, 8);
  var material = new THREE.MeshBasicMaterial( {color: 0xcccccc, side: THREE.DoubleSide } );
  plane = new THREE.Mesh( geometry, material );

  for (var i = 0, l = plane.geometry.vertices.length; i < l; i++) {
    plane.geometry.vertices[i].z = Math.random() + 2;
    terrain[i] = plane.geometry.vertices[i].z;
  }

  
 
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  

  //plane.castShadow = true; //default is false
  //plane.receiveShadow = true; //default
  
  scene.add(plane);

  //cube
  var geometry = new THREE.CubeGeometry(1,1,1);
  var material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
  var cube = new THREE.Mesh( geometry, material );
  cube.position.set(-4,0,0.5);
  cube.rotation.z = 0.5;
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add( cube );
     
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};