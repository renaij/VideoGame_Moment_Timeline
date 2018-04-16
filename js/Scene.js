var renderer, scene, camera;
var moments, cylinder;
var controls;
var rayCaster;
var mouse;
var interactionObjects = [];

var selectedSprite;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );
  // scene.fog = new THREE.FogExp2( 0x000000, 0.0009 );
  camera = new THREE.PerspectiveCamera( 75, WIDTH / HEIGHT, 0.1, spaceScale*2.0);
  camera.position.x = 0.0;
  camera.position.y = 0.0;
  camera.position.z = 5.0;
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( WIDTH, HEIGHT );

  var container = document.getElementById( 'container' );
  container.appendChild( renderer.domElement );

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  updateSprites(imageNumber,spaceScale, imageSize);
  //updateMoments(imageNumber);

  controls = new THREE.OrbitControls( camera, renderer.domElement);
  controls.enableKeys = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = .1;
  controls.update();

  //Interactions
  window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener( 'mousedown', onMouseClicked, false );

}
function onMouseClicked() {
  console.log('mouse clicked');
  // update the mouse position
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  console.log("mouse.x=" + toString(mouse.x) + ";mouse.y=" + toString(mouse.y) );
  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects( interactionObjects );
  // if there is one (or more) intersections
	if ( intersects.length > 0 )
	{
		console.log("Hit @ " + toString( intersects[0].sprite ) );
		// change the color of the closest face.
    intersects[ 0 ].object.material.color.setHex( 0x10ffff );

	} else {
    // restore the color of the objects
  }

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

  controls.update();
  render();
}

var last_updated_time = performance.now();

function render() {
  var now = performance.now();
  var delta = now - last_updated_time;

  // move around camera
  // // camera.position.x = 0.0;
  // // camera.position.y = 0.0;
  // camera.position.z -= 0.01 * Math.sin(delta * 0.01);

  // console.log(camera.position);
  last_updated_time = now;
  renderer.render( scene, camera );
}
