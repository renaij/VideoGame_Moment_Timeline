var renderer, scene, camera, controls, skybox;
var interactionObjects = [];
var spriteDictionary = {};
var highlighted = null;
var lastSelected = {line: null, object: null};
var flyTo = null, flyFrom = null;
var isFlying = false;
var visibleLabels = {};
var spriteGroups = {};
var currentTarget = null; //counter for current focused object
var dimension = "3";

init();
//initScene();
//animate();

function init() {
  var params = parseURL();
  dimension = params.dimension;
  var game = params.game;
  $.getJSON("gameinfo.json", function(result){
    spriteJSONPath = result[game][dimension];
    initScene();
    animate();
  });

}

function initScene() {
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( WIDTH , HEIGHT );

  var container = document.getElementById( 'container' );
  container.appendChild( renderer.domElement );

  scene = new THREE.Scene();
  // scene.fog = new THREE.FogExp2( 0x000000, 0.0009 );
  camera = new THREE.PerspectiveCamera( 75, WIDTH / HEIGHT, 0.1, spaceScale*2.0);
  camera.position.x = 0.0;
  camera.position.y = 0.0;
  camera.position.z = spaceScale * - 0.8  ;

  if (dimension == "2"){
    camera.position.y = 30.0;
  }

  controls = new THREE.OrbitControls( camera, renderer.domElement);
  controls.enableKeys = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = autoRotateSpeed;
  controls.maxDistance = spaceScale * 0.8;
  controls.update();

  addSkybox();
  addSprites();

  //Interactions
  window.addEventListener( 'resize', onWindowResize, false );
  window.addEventListener( 'mousedown', onMouseDown, false );
  window.addEventListener( 'mouseup', onMouseUp, false );
  window.addEventListener( 'mousemove', onMouseMove, false );
  window.addEventListener( 'keydown', onKeydown, false );
  window.addEventListener( 'keyup', onKeyup, false );
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
