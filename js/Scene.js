var renderer, scene, camera, controls, skybox;
var interactionObjects = {};
var spriteDictionary = {};
var highlighted = null;
var lastSelected = {line: null, object: null};
var flyTo = null, flyFrom = null;
var isFlying = false;
var visibleLabels = {};
var spriteGroups = {};
var currentTarget = null; //counter for current focused object
var initParams = null; //Used to store parameters parsed from the URL
var actionCounter = 0;
var expectedActions = 0;
var isPageShown = false;
var autoRotate = true;
//////////////////////////////////Chris's variables
var moveFoward = false;
var moveBackward = false;
var turnLeft = false;
var turnRight = false;
var turnUp = false;
var turnDown = false; //variables for moving and turning
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var rotationVector = new THREE.Vector3( 0, 0, 0 );
var tmpQuaternion = new THREE.Quaternion();
var clock = new THREE.Clock();//variables for turning direction and moving speed


////////////////////////////////////
init();

function init() {
  initAudio();
  expectedActions += 1;
  initParams = parseURL(window.location.href);
  $.getJSON("gameinfo.json", function(result){
    spriteJSONPath = result[initParams.game][initParams.dimension];
    addGameInfo(initParams.game);
    initScene();
    animate();
    actionCounter += 1;
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

  if (initParams.dimension == "2"){
    camera.position.y = 30.0;
  }

  controls = new THREE.OrbitControls( camera, renderer.domElement);
  controls.enableKeys = true;
  //controls.autoRotate = true;
  //controls.autoRotateSpeed = autoRotateSpeed;
  controls.maxDistance = spaceScale * 0.8;
  controls.update();

  addSkybox();
  addSprites();

  //Interactions
  window.addEventListener( 'resize', onWindowResize, false );
  document.getElementById("container").addEventListener( 'mousedown', onMouseDown, false );
  document.getElementById("container").addEventListener( 'mouseup', onMouseUp, false );
  document.getElementById("container").addEventListener( 'mousemove', onMouseMove, false );
  // window.addEventListener( 'mousedown', onMouseDown, false );
  // window.addEventListener( 'mouseup', onMouseUp, false );
  // window.addEventListener( 'mousemove', onMouseMove, false );
  window.addEventListener( 'keydown', onKeydown, false );
  window.addEventListener( 'keyup', onBookmarking, false ); //Keyboard 'B'
  window.addEventListener( 'keyup', onReadBookmark, false ); //Keyboard '+' and '-'
  window.addEventListener( 'keyup', onKeyup, false );
  //////////////////////////////////////////////////chris's code
  window.addEventListener( 'keyup', myKeyUp, false );
  window.addEventListener( 'keydown', myKeyDown, false );
  ///////////////////////////////////////////////////////
}

function animate() {
  loadingScene();
  render();
  requestAnimationFrame( animate );
  TWEEN.update();
  var now = performance.now();
  skybox.material.uniforms.time.value = now * 0.0005;
  //Autorotate camera
  if (autoRotate)
  {
    //controls.update();
    camera.rotation.x += 0.00001*90 * Math.PI / 180;
    camera.rotation.z += 0.00001*90 * Math.PI / 180;
  }

  ///////////////////////////////////////Chris's code
  var delta = (now - prevTime)/1000;
  velocity.z -= velocity.z * 10.0 * delta;
  direction.z = Number( moveFoward ) - Number (moveBackward);
  direction.normalize();
  if(moveFoward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
  camera.translateZ( velocity.z * delta );//for moving forward and backward
  turning();
  ////////////////////////////////////////////////
}
function render() {
  renderer.render( scene, camera );
}
function cameraReady() {
  if ("position" in initParams) {
    var positions = initParams['position'];
    if (positions.length == 3) {
      camera.position.x = positions[0];
      camera.position.y = positions[1];
      camera.position.z = positions[2];
    }
  }
  if ("moment_id" in initParams) {
    var inputMomentId = Number(initParams['moment_id']);
    showNearbyLabels(spriteDictionary[inputMomentId].object);
    updateURL(inputMomentId);
  }
}

//////////////////////////chris's new code
function turning(){
  var factor = clock.getDelta() * 0.25;
  tmpQuaternion.set( rotationVector.x * factor, rotationVector.y * factor, rotationVector.z * factor, 1).normalize();
  camera.quaternion.multiply( tmpQuaternion ); //for rotation vector
}
//////////////////////////////////////////////////
