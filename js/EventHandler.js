function onMouseClicked() {
  if (!isFlying) {

    // update the mouse position
  	mouse.x = ( event.clientX / window.innerWidth ) * 2.0 - 1.0;
  	mouse.y = - ( event.clientY / window.innerHeight ) * 2.0 + 1.0;

    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( interactionObjects, true );

    var points = [];
    resetMetaLabel();
    resetSprite();
    resetLines();
    currentTarget = 0;

    // if there is one (or more) intersections
  	if ( intersects.length > 0 )
  	{
      controls.autoRotate = false;
      console.log("clicked:" + intersects[0].object.name );
      lastSelected.object = intersects[0].object;
      var spriteId = Number(intersects[0].object.name);
      currentTarget = spriteId;
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
        points.push(spriteDictionary[index].object.position);
      }
      //console.log("points:" + points.length);
      //console.log("object id:" + spriteId.toString());
      //Draw lines between nearby moments:
      //lastSelected.line = drawLine(points);

      for (var n = 0; n < spriteGroup.children.length; n++)
      {
        if (Number(spriteGroup.children[n].name) < start || Number(spriteGroup.children[n].name) > stop)
        {
          spriteGroup.children[n].material.opacity = 0.1;
        } else {
          //Create detailed views and hide low-res views
          generate_label(spriteDictionary[n]);
        }
      }
      //Moving forward to the target object
      direction = raycaster.ray.direction.clone().normalize(); //.multiply(new THREE.Vector3(-1.0,-1.0,-1.0));
      direction.multiplyScalar(FLY_STOP_DISTANCE);
      target = intersects[0].object.position.clone();
      target.sub(direction) ;
      flyTo =  target;
      var controlRange = spaceScale - target.length();
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
          controls.maxDistance = controlRange;
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
          if (spriteDictionary[spriteId].labelSprite != null)
          {
            jump(spriteDictionary[spriteId].labelSprite);
          }
        });
        tween_rotate.chain(tween_forward);
  	} else {
      controls.autoRotate = true;
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
function resetSprite(){
  if (lastSelected.object != null)
  {
    for (var n = 0; n < spriteGroup.children.length; n++)
    {
      spriteGroup.children[n].material.opacity = 1.0;
      spriteGroup.children[n].visible = true;
    }
  }
}
function resetMetaLabel(){
  for (var key in visibleLabels){
    // visibleLabels[key].visible = false;
    // delete visibleLabels[key];
    makeInvisible(visibleLabels[key]);
  }
}
function resetLines(){
  if (lastSelected.line != null)
  {
    scene.remove(lastSelected.line) ;
    lastSelected.line = null;
  }
}

function onKeydown(event){

  if (lastSelected.object != null && event.key == '.'){
    currentTarget += 1;
    if (spriteDictionary[currentTarget].labelSprite == null)
    {
      generate_label(spriteDictionary[currentTarget], true);
    } else {
      jump(spriteDictionary[currentTarget].labelSprite);
    }

  } else if (lastSelected.object!= null && event.key == ','){
    currentTarget -= 1;
    if (spriteDictionary[currentTarget].labelSprite == null)
    {
      generate_label(spriteDictionary[currentTarget], true);
    } else {
      jump(spriteDictionary[currentTarget].labelSprite);
    }
  }
}
function onKeyup(event){

}
