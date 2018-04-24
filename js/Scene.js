var renderer, scene, camera, controls, skybox;
var interactionObjects = [];
var spriteDictionary = {};
var highlighted = null;
var lastSelected = {line: null, object: null};
var flyTo = null, flyFrom = null;
var flyStep = new THREE.Vector3();
var isFlying = false;
var metaLabel = null;
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
  updateSprites_buffer();
  //updateMoments(imageNumber);

  controls = new THREE.OrbitControls( camera, renderer.domElement);
  controls.enableKeys = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = autoRotateSpeed;
  controls.update();

  //Interactions
  window.addEventListener( 'resize', onWindowResize, false );
  window.addEventListener( 'mouseup', onMouseClicked, false );
  window.addEventListener( 'mousemove', onMouseMove, false );

}

function onMouseClicked() {
  if (!isFlying) {
    // update the mouse position
  	mouse.x = ( event.clientX / window.innerWidth ) * 2.0 - 1.0;
  	mouse.y = - ( event.clientY / window.innerHeight ) * 2.0 + 1.0;
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( interactionObjects, true );

    var points = [];
    resetMetaLabel();
    resetMaterial();
    resetLines();

    // if there is one (or more) intersections
  	if ( intersects.length > 0 )
  	{
      //console.log("mouse.x=" + mouse.x.toString() + ";mouse.y=" + mouse.y.toString() );
      lastSelected.object = intersects[0].object;
      var spriteId = Number(intersects[0].object.name);
      var totalNumber = Object.keys(spriteDictionary).length;
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
      //console.log("points:" + points.length);
      //console.log("object id:" + spriteId.toString());
      //Draw lines between nearby moments
      lastSelected.line = drawLine(points);

      momentLabel.name = 'Moment Index: ' + intersects[0].object.name;
      momentLabel.game = game;
      momentLabel.corpus = corpus;
      generate_text(momentLabel,intersects[0].object.position);

      for (var n = 0; n < spriteGroup.children.length; n++)
      {
        if (Number(spriteGroup.children[n].name) < start || Number(spriteGroup.children[n].name) > stop)
        {
          spriteGroup.children[n].material.opacity = 0.1;
        }
      }
      //Moving forward to the target object
      direction = raycaster.ray.direction.clone().normalize(); //.multiply(new THREE.Vector3(-1.0,-1.0,-1.0));
      direction.multiplyScalar(FLY_STOP_DISTANCE);
      target = intersects[0].object.position.clone();
      target.sub(direction) ;
      flyTo =  target;
      flyFrom = camera.position;
      isFlying = true;
      lookAtOrg = controls.target.clone();
      lookAtDest = intersects[0].object.position;
      duration = flyingDuration;
      //reference to http://sole.github.io/tween.js/examples/03_graphs.html
      var tween_rotate = new TWEEN.Tween(lookAtOrg, duration/2).to(lookAtDest).easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(function(){
          camera.lookAt(this.x, this.y, this.z);})
        .onComplete(function () {
          controls.target = lookAtDest;
          isFlying = false;})
        .start();
      var tween_forward = new TWEEN.Tween(flyFrom)
        .to(flyTo, duration)
        .easing(TWEEN.Easing.Quintic.InOut)
        .onUpdate(function () {
          isFlying = true;
          camera.position.set(this.x, this.y, this.z);
          //IMPORTANT!
          camera.lookAt(intersects[0].object.position);
        })
        .onComplete(function () {
          isFlying = false;
        });
        tween_rotate.chain(tween_forward);
  	} else {
      // reset objects
      //console.log('Nothing got clicked');
    } //end of intersect.length > 0
  } // end of isFlying
}
function onMouseMove(event) {
  event.preventDefault();
  // update the mouse position
  mouse.x = ( event.clientX / window.innerWidth ) * 2.0 - 1.0;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2.0 + 1.0;

  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( interactionObjects, true );
  // if there is one (or more) intersections
  if ( intersects.length > 0 )
  {
    resetHightLight();
    highlighted = intersects[0].object;
    highlighted.material.color.setHex( 0x10ffff );
  } else {
    resetHightLight();
  }
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function resetHightLight() {
  if (highlighted != null)
  {
    highlighted.material.color.setHex( 0xffffff );
  }
}
function resetMaterial(){
  if (lastSelected != null)
  {
    for (var n = 0; n < spriteGroup.children.length; n++)
    {
      spriteGroup.children[n].material.opacity = 1.0;
    }
  }
}
function resetMetaLabel(){
  if (metaLabel != null)
  {
      metaLabel.material.opacity = 0;
  }
}
function resetLines(){
  if (lastSelected != null && lastSelected.line != null)
  {
    scene.remove(lastSelected.line) ;
    lastSelected.line = null;
  }
}

//var last_updated_time = performance.now();
function animate() {
  TWEEN.update();
  requestAnimationFrame( animate );

  var now = performance.now();
  skybox.material.uniforms.time.value = now*0.0005;
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
