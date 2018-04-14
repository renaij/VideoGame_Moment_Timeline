var renderer, scene, camera;
var moments, cylinder;
var controls;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );
  // scene.fog = new THREE.FogExp2( 0x000000, 0.0009 );
  camera = new THREE.PerspectiveCamera( 75, WIDTH / HEIGHT, 0.1, spaceScale*2.0);
  camera.position.z = 5.0;
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( WIDTH, HEIGHT );

  var container = document.getElementById( 'container' );
  container.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize, false );

  updateSprites(imageNumber,spaceScale, imageSize);

  //updateMoments(imageNumber);


  // cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 0, 10, 100, 12 ), new THREE.MeshNormalMaterial() );
	// scene.add( cylinder );


  controls = new THREE.OrbitControls( camera, renderer.domElement);
  controls.enableKeys = true;
  controls.update();

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  requestAnimationFrame( animate );
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  //cylinder.lookAt(camera);
  controls.update();
  render();
}

function render() {
  renderer.render( scene, camera );
}
