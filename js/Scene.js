var renderer, scene, camera, controls, skybox;
var interactionObjects = [];
var spriteDictionary = {};
var highlighted = null;
var lastSelected = {line: null, object: null};
var flyTo = null, flyFrom = null;
var flyStep = new THREE.Vector3();
var isFlying = false;
var spriteScale = null;
var momentLabel = {name: null, game: null, corpus: null};

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xf8f8f8 );
  // scene.fog = new THREE.FogExp2( 0x000000, 0.0009 );
  camera = new THREE.PerspectiveCamera( 75, WIDTH / HEIGHT, 0.1, spaceScale*2.0);
  camera.position.x = 0.0;
  camera.position.y = 0.0;
  camera.position.z = spaceScale * -0.5 ;
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( WIDTH , HEIGHT );

  var container = document.getElementById( 'container' );
  container.appendChild( renderer.domElement );

  skybox();
  addSprites();
  //updateMoments(imageNumber);

  controls = new THREE.OrbitControls( camera, renderer.domElement);
  controls.enableKeys = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = autoRotateSpeed;
  controls.maxDistance = spaceScale;
  controls.update();

  //Interactions
  window.addEventListener( 'resize', onWindowResize, false );
  window.addEventListener( 'mouseup', onMouseClicked, false );
  window.addEventListener( 'mousemove', onMouseMove, false );

}

//var last_updated_time = performance.now();
function animate() {
  TWEEN.update();
  requestAnimationFrame( animate );

  var now = performance.now();
  skybox.material.uniforms.time.value = now * 0.0005;
  // var delta = now - last_updated_time;
  // last_updated_time = now;
  if (!isFlying)
  {
    controls.update();
  }
  render();
}
function render() {
  renderer.render( scene, camera );
}
