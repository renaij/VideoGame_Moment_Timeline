var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var renderer, scene, camera, controls, skybox;
var interactionObjects = {};
var spriteDictionary = {};
var metalabelDictionary = {};
var highlighted = null; //current hightlighted object when mouseover
var lastSelected = {line: null, object: null}; //last clicked object
var isFlying = false;
var visibleLabels = {}; //Labels that are visible in camera view
var spriteGroups = {}; //Sprites are grouped as corpus
var currentTarget = null; // ID of current focused object
var actionCounter = 0;
var expectedActions = 0;
var isPageShown = false;
var autoRotate = true;
var spriteJSONPath = null;
var animation = null;
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
  urlParams = parseURL(window.location.href);
  $.getJSON("gameinfo.json", function(result){
    spriteJSONPath = result[urlParams.game][urlParams.dimension];
    addGameInfo(urlParams.game);
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
  camera = new THREE.PerspectiveCamera( 75, WIDTH / HEIGHT, 0.1, SPACE_SCALE*2.0);
  camera.position.x = 0.0;
  camera.position.y = 0.0;
  camera.position.z = SPACE_SCALE * - 0.1  ;

  if (urlParams.dimension == "2"){
    camera.position.y = 30.0;
  }

  controls = new THREE.OrbitControls( camera, renderer.domElement);
  controls.enableKeys = true;
  controls.maxDistance = SPACE_SCALE * 0.8;
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
  requestAnimationFrame( animate );
  render();
  TWEEN.update();
  // var delta = clock.getDelta();
  // if (animation != null) {
  //   animation.update(1000 * delta);
  // }
  var now = performance.now();
  skybox.material.uniforms.time.value = now * 0.0005;
  //Autorotate camera
  if (autoRotate)
  {
    //controls.update();
    camera.rotation.x += AUTO_ROTATE_SPEED * 90 * Math.PI / 180;
    camera.rotation.z += AUTO_ROTATE_SPEED * 90 * Math.PI / 180;
  }

  //////////////////////////Chris's code: Navigation////////////////////////////
  var delta = (now - prevTime)/1000;
  velocity.z -= velocity.z * 10.0 * delta;
  direction.z = Number( moveFoward ) - Number (moveBackward);
  direction.normalize();
  if(moveFoward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
  camera.translateZ( velocity.z * delta );//for moving forward and backward
  turning();
  //////////////////////////////////////////////////////////////////////////////
  prevTime = now;
  camera.updateProjectionMatrix();
}
function render() {
  renderer.render( scene, camera );
}
function loadingScene() {
  if ((actionCounter == expectedActions) && (!isPageShown))
  {
    addCorporaButtons();
    //animation = new momentAnimator(dataPool[Object.keys(spriteGroups)[0]].texture, dataPool[Object.keys(spriteGroups)[0]].UVs);
    //animation.start(0, 100, 60);
    cameraReady();
    showPage();
    isPageShown = true;
  }
}
function cameraReady() {
  if (URLKeys.POSITION in urlParams) {
    var positions = urlParams[URLKeys.POSITION];
    if (positions.length == 3) {
      camera.position.x = positions[0];
      camera.position.y = positions[1];
      camera.position.z = positions[2];
    }
  }
  if (URLKeys.MOMENT in urlParams && urlParams[URLKeys.MOMENT] != "null") {
    var inputMomentId = Number(urlParams[URLKeys.MOMENT]);
    showNearbyLabels(inputMomentId, 1.0, true);
    updateURL(URLKeys.MOMENT, inputMomentId);
  }
  if (URLKeys.BOOKMARK in urlParams && urlParams[URLKeys.BOOKMARK] != "null") {
    var bookmarks = urlParams[URLKeys.BOOKMARK];
    for (var i=0; i<bookmarks.length;i++){
      addBookmark(bookmarks[i]);
    }
  }
}

//////////////////////////chris's new code
function turning(){
  var factor = clock.getDelta() * 0.25;
  tmpQuaternion.set( rotationVector.x * factor, rotationVector.y * factor, rotationVector.z * factor, 1).normalize();
  camera.quaternion.multiply( tmpQuaternion ); //for rotation vector
}
//////////////////////////////////////////////////
