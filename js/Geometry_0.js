
var totalMap = textureLoader.load('./pic/moment-atlas-test.png');
var totalWidth = 4096.0;
var totalHeight = 4096.0;
var uvWidth = imageSize.width / totalWidth;
var uvHeight = imageSize.height / totalHeight;
var columns = totalWidth / imageSize.width;

var getImageMap = function(imgIdx){
  columnIndex = imgIdx % columns;
  rowIndex = (imgIdx - columnIndex)/columns;
  var xOffset = uvWidth * columnIndex;
  var yOffset = uvHeight * rowIndex;
  return {xOffset: xOffset, yOffset:yOffset};
}
var addMoment = function(momentObj){
  var geometry = new THREE.Geometry();
  var material = momentObj.material;
  var imageIdx = momentObj.index;
  geometry.vertices.push(
    //0
    new THREE.Vector3(
      momentObj.position.x,
      momentObj.position.y,
      momentObj.position.z
    ),
    //1
    new THREE.Vector3(
      momentObj.position.x + momentObj.width,
      momentObj.position.y,
      momentObj.position.z
    ),
    //2
    new THREE.Vector3(
      momentObj.position.x + momentObj.width,
      momentObj.position.y + momentObj.height,
      momentObj.position.z
    ),
    //3
    new THREE.Vector3(
      momentObj.position.x,
      momentObj.position.y + momentObj.height,
      momentObj.position.z
    )
  );
  var sizeofVertices = geometry.vertices.length;
  geometry.faces.push( new THREE.Face3( 0,1,2) );
  geometry.faces.push( new THREE.Face3( 0,2,3) );

  //Using texture atlas
  var imageMap = getImageMap(imageIdx);
  var xOffset = imageMap.xOffset;
  var yOffset = imageMap.yOffset;
  geometry.faceVertexUvs[0][0] = [
    new THREE.Vector2(xOffset, yOffset),
    new THREE.Vector2(xOffset+uvWidth, yOffset),
    new THREE.Vector2(xOffset+uvWidth, yOffset+uvHeight)
  ]
  geometry.faceVertexUvs[0][1] = [
    new THREE.Vector2(xOffset, yOffset),
    new THREE.Vector2(xOffset+uvWidth, yOffset+uvHeight),
    new THREE.Vector2(xOffset, yOffset+uvHeight)
  ]

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

var updateMoments = function(number){
  var position;
  var momentObj;
  var fileNameLength = 9;
  var material = new THREE.MeshBasicMaterial({
    map: totalMap
  });
  for (var i = 0; i < number; i++){
    position = {
      x: THREE.Math.randFloatSpread( spaceScale ),
      y: THREE.Math.randFloatSpread( spaceScale ),
      z: THREE.Math.randFloatSpread( spaceScale )
    }
    momentObj = {
      index: i,
      position: position,
      width: imageSize.width,
      height: imageSize.height,
      material: material
    }
    addMoment(momentObj);
  }
}
