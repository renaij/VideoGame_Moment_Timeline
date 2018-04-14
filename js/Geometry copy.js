
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
  var imageMap = getImageMap(imageIdx, uvWidth, uvHeight, columns);
  // geometry.faceVertexUvs[0][0] = [
  //   new THREE.Vector2(0, 0),
  //   new THREE.Vector2(1, 0),
  //   new THREE.Vector2(1, 1)
  // ]
  // geometry.faceVertexUvs[0][1] = [
  //   new THREE.Vector2(0, 0),
  //   new THREE.Vector2(1, 1),
  //   new THREE.Vector2(0, 1)
  // ]

  geometry.faceVertexUvs[0][0] = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(1, 0),
    new THREE.Vector2(1, 1)
  ]
  geometry.faceVertexUvs[0][1] = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(1, 1),
    new THREE.Vector2(0, 1)
  ]

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

var updateMoments = function(number, spaceScale, imageSize){
  var position = {
    x: 0.0,
    y: 0.0,
    z: 0.0
  }
  var momentObj = {
    index: 0,
    position: position,
    width: imageSize.width,
    height: imageSize.height,
    texture: null
  }
  var fileNameLength = 9;
  for (var i = 0; i < number; i++){
    var filename = i + '.png';
    filename = '0'.repeat(fileNameLength - filename.length) + filename;
    var texMap = textureLoader.load('./pic/thumbnails/' + filename);
    var material = new THREE.MeshBasicMaterial({
      map: texMap
    });

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
