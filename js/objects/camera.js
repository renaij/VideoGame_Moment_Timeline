//Jump between moments
var _jumpToTarget = function(target){
  camera.lookAt(target.position);
  cameraPos = target.position.clone();
  var lookAtVector = new THREE.Vector3(0,0, -1);
  lookAtVector.applyQuaternion(camera.quaternion).normalize();
  lookAtVector.multiplyScalar(FLY_STOP_DISTANCE);
  cameraPos.sub(lookAtVector) ;
  camera.position.set(cameraPos.x, cameraPos.y,cameraPos.z);
  controls.target = target.position;
  _showTarget(target);
}
var frustum = new THREE.Frustum();
var cameraViewProjectionMatrix = new THREE.Matrix4();
//Show only the target sprite, hiding other sprites in camera view
var _showTarget = function(target){
  //every time the camera or objects change position (or every frame)
  camera.updateMatrixWorld(); // make sure the camera matrix is updated
  camera.matrixWorldInverse.getInverse( camera.matrixWorld );
  cameraViewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
  frustum.setFromMatrix( cameraViewProjectionMatrix );
  var isInCamera = false;
  // frustum is now ready to check all the objects you need
  for (var key in visibleLabels)
  {
    var distance = 0;
    isInCamera = frustum.intersectsSprite( visibleLabels[key])
    if (isInCamera)
    {
      makeInvisible(visibleLabels[key]);
    }
  }
  makeVisible(target);
}
var makeVisible = function(obj){
  obj.visible = true;
  visibleLabels[obj.name] = obj;
}
var makeInvisible = function(obj){
  obj.visible = false;
  delete visibleLabels[obj.name];
}
//Move the camera to target by flying over
var flyToTarget = function(targetObj, skipAnimation = false){
  var targetId = Number(targetObj.name);
  startingTime = performance.now();
  //Moving forward to the target object
  direction = raycaster.ray.direction.clone().normalize();
  direction.multiplyScalar(FLY_STOP_DISTANCE);
  target = targetObj.position.clone();
  target.sub(direction) ;
  flyTo =  target;
  //var controlRange = spaceScale - target.length();
  flyFrom = camera.position;
  isFlying = true;
  lookAtOrg = controls.target.clone();
  lookAtDest = targetObj.position;
  duration = flyingDuration;
  if (skipAnimation) {
    isFlying = false;
    controls.target = lookAtDest;
    camera.lookAt(targetObj.position);
    if (spriteDictionary[targetId].labelSprite != null)
    {
      _jumpToTarget(spriteDictionary[targetId].labelSprite);
      updateURL(targetId);
    }

    return;
  }
  // console.log('DEBUGGING: Flying Started - ' + (performance.now() - startingTime)); startingTime = performance.now();

  //reference to http://sole.github.io/tween.js/examples/03_graphs.html
  var tween_rotate = new TWEEN.Tween(lookAtOrg, duration/2).to(lookAtDest).easing(TWEEN.Easing.Cubic.Out)
    .onUpdate(function(){
      camera.lookAt(this.x, this.y, this.z);})
    .onComplete(function () {
      playSound(soundOnShow); //Sound for Clicking
      controls.target = lookAtDest;
      //controls.maxDistance = controlRange;
      isFlying = false;})
    .start();
  var tween_forward = new TWEEN.Tween(flyFrom)
    .to(flyTo, duration)
    .easing(TWEEN.Easing.Quintic.InOut)
    .onUpdate(function () {
      isFlying = true;
      camera.position.set(this.x, this.y, this.z);
      //IMPORTANT!
      camera.lookAt(targetObj.position);
    })
    .onComplete(function () {
      isFlying = false;
      // console.log('DEBUGGING: Flying Finished - ' + (performance.now() - startingTime)); startingTime = performance.now();
      if (spriteDictionary[targetId].labelSprite != null)
      {
        _jumpToTarget(spriteDictionary[targetId].labelSprite);
        updateURL(targetId);
      }

    });
    tween_rotate.chain(tween_forward);
}
function getFrustrum(){
  //every time the camera or objects change position (or every frame)
  camera.updateMatrixWorld(); // make sure the camera matrix is updated
  camera.matrixWorldInverse.getInverse( camera.matrixWorld );
  cameraViewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
  frustum.setFromMatrix( cameraViewProjectionMatrix );
}
function isInCameraView(object) {
  return frustum.intersectsSprite( object);
}
function distanceToCamera(object) {
  return object.position.distanceTo( camera.position );
}
