var renderer, scene, camera, controls, mouse;
var moments;
var rayCaster;
var interactionObjects = [];
var spriteDictionary = {};
var lastSelected = {line: null, object: null};

var flyTo = null, flyFrom = null;
var flyStep = new THREE.Vector3();
var FLY_STOP_DISTANCE = 500;


init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xf8f8f8 );
  // scene.fog = new THREE.FogExp2( 0x000000, 0.0009 );
  camera = new THREE.PerspectiveCamera( 75, WIDTH / HEIGHT, 0.1, spaceScale*2.0);
  camera.position.x = 0.0;
  camera.position.y = 0.0;
  camera.position.z = spaceScale * -1.0;
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( WIDTH, HEIGHT );

  var container = document.getElementById( 'container' );
  container.appendChild( renderer.domElement );

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  updateSprites_buffer();
  //updateMoments(imageNumber);

  controls = new THREE.OrbitControls( camera, renderer.domElement);
  controls.enableKeys = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = autoRotateSpeed;
  controls.update();

  //Interactions
  window.addEventListener( 'resize', onWindowResize, false );
  window.addEventListener( 'mousedown', onMouseClicked, false );
  //document.addEventListener( 'dblclick', onDoubleclick, false );

}
function onMouseClicked() {
  console.log('mouse clicked');
  // update the mouse position
	mouse.x = ( event.clientX / window.innerWidth ) * 2.0 - 1.0;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2.0 + 1.0;
  //rayCaster.far = spaceScale;
  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects( interactionObjects, true );
  var points = [];
  // if there is one (or more) intersections
	if ( intersects.length > 0 )
	{
    console.log("mouse.x=" + mouse.x.toString() + ";mouse.y=" + mouse.y.toString() );
		// For debug: change the color of the closest face.
    if (lastSelected.object != null)
    {
      lastSelected.object.material.color.setHex( 0xffffff );
      if (lastSelected.line != null)
      {
        scene.remove(lastSelected.line) ;
        lastSelected.line = null;
      }
    }

    intersects[0].object.material.color.setHex( 0x10ffff );
    lastSelected.object = intersects[0].object;

    var spriteId = Number(intersects[0].object.name);
    var totalNumber = spriteDictionary.length;
    var start = 0;
    start = spriteId - adjacentMoments;
    stop = spriteId + adjacentMoments;
    if (start < -1)
    {
      start = 0;
    }
    if (stop >  totalNumber - 1)
    {
      stop = totalNumber - 1
    }
    for (var index = start; index <= stop; index++)
    {
      points.push(spriteDictionary[index].position);
    }
    console.log("points:" + points.length);
    console.log("object id:" + spriteId.toString());
    lastSelected.line = drawLine(points);
    //drawArrows(points);
    // controls.target = intersects[0].object.position;
    flyTo = intersects[0].object.position;
    flyFrom = camera.position;
    flyStep.subVectors(flyTo, flyFrom);
    flyStep.divideScalar(200.0);
    camera.lookAt(flyTo);
    controls.target = flyTo.clone();
	} else {
    // reset objects
    console.log('Nothing got clicked');
    flyTo = null;
  }

}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
//var last_updated_time = performance.now();
function animate() {
  requestAnimationFrame( animate );
  // var now = performance.now();
  // var delta = now - last_updated_time;
  // last_updated_time = now;
  camera.aspect = window.innerWidth / window.innerHeight;

  if (flyTo != null) {
    flyFrom.addVectors(flyFrom, flyStep);

    if (flyFrom.distanceTo(flyTo) < FLY_STOP_DISTANCE) {
      flyTo = null;
    } else {
      camera.position.set(flyFrom.x, flyFrom.y, flyFrom.z);
    }
  } else {
    controls.update();  // saves a bit of CPU time
  }

  camera.updateProjectionMatrix();

  render();
}



function render() {

  renderer.render( scene, camera );
}
