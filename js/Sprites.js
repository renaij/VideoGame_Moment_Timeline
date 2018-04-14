
var getImageMapSprite = function(imgIdx, totalMap){
  var totalWidth = 4096.0;
  var totalHeight = 4096.0;
  var uvWidth = imageSize.width / totalWidth;
  var uvHeight = imageSize.height / totalHeight;
  var columns = totalWidth / imageSize.width;

  columnIndex = imgIdx % columns;
  rowIndex = (imgIdx - columnIndex)/columns;
  var mapCloned = totalMap.clone();
  mapCloned.needsUpdate = true;
  //mapCloned.__webglTexture = totalMap.__webglTexture;
  //mapCloned.__webglInit = true;
  mapCloned.offset = new THREE.Vector2(uvWidth * columnIndex, uvHeight * rowIndex);
  mapCloned.repeat = new THREE.Vector2(uvWidth, uvHeight);
  return mapCloned;
}

var updateSprites = function(number){
    var position;
    var momentObj;
    var scaleMultiplier = 200.0;
    var group = new THREE.Group();
    var totalMap = textureLoader.load('./spritesheet0.png');
    var jsonFile = new THREE.FileLoader().load('./spritesheet0.png.json',function(data){
      var jsonObj = JSON.parse(data);
      number = jsonObj.totalCount;
      var fileNameLength = 9;
      for (var i = 0; i < number; i++){
        var spriteMaterial = new THREE.SpriteMaterial( { map: totalMap, color: 0xffffff} );

        //var filename = i + '.png';
        //filename = '0'.repeat(fileNameLength - filename.length) + filename;
        //var spriteMap = textureLoader.load('./pic/thumbnails/' + filename);
        //var imageMap = getImageMapSprite(i,spritesheet);
        position = {
          //THREE.Math.randFloatSpread( spaceScale ),
          x: parseFloat(jsonObj[i].position.x)*scaleMultiplier,
          y: parseFloat(jsonObj[i].position.y)*scaleMultiplier,
          z: parseFloat(jsonObj[i].position.z)*scaleMultiplier,
        }
        momentObj = {
          index: i,
          position: position,
          material: spriteMaterial,
          width: jsonObj.spriteWidth,
          height: jsonObj.spriteHeight,
          uvOffset_u: jsonObj[i].uvOffset_u,
          uvOffset_v: jsonObj[i].uvOffset_v,
          uvWidth: jsonObj[i].uvRepeat_u,
          uvHeight: jsonObj[i].uvRepeat_v
        }

        spriteMaterial.offset.x = momentObj.uvOffset_u;
        spriteMaterial.offset.y = momentObj.uvOffset_v;
        spriteMaterial.repeat.x = momentObj.uvWidth;
        spriteMaterial.repeat.y = momentObj.uvHeight;

        var sprite = new THREE.Sprite( spriteMaterial );
        sprite.position.set(position.x, position.y, position.z);
        sprite.scale.set( momentObj.width, momentObj.height, 1.0 );
        group.add( sprite );
      }
      scene.add(group);
    });
};
