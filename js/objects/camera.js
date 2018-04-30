
var jump = function(target){
  camera.lookAt(target.position);
  cameraPos = target.position.clone();
  var lookAtVector = new THREE.Vector3(0,0, -1);
  lookAtVector.applyQuaternion(camera.quaternion).normalize();
  lookAtVector.multiplyScalar(FLY_STOP_DISTANCE);
  cameraPos.sub(lookAtVector) ;
  camera.position.set(cameraPos.x, cameraPos.y,cameraPos.z);
  controls.target = target.position;
  showTarget(target);
}
var frustum = new THREE.Frustum();
var cameraViewProjectionMatrix = new THREE.Matrix4();

var showTarget = function(target){
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

  // raycaster.set( camera, obj);
  // var intersects = raycaster.intersectObjects(interactionObjects,true);
  // if (intersects.length > 0){
  //   for (var i = 0; i < intersects.length; i++)
  //   {
  //     console.log(intersects[i].name);
  //   }
  // }
}

var makeVisible = function(obj){
  obj.visible = true;
  visibleLabels[obj.name] = obj;
}
var makeInvisible = function(obj){
  obj.visible = false;
  delete visibleLabels[obj.name];
}
