var getImageMap = function(imgIdx, uvWidth, uvHeight, columns, texture){
  imageMap = texture.clone();


  //columnIndex = imgIdx % columns;
  //rowIndex = (imgIdx - columnIndex) / columns;

  imageMap.offset = new THREE.Vector2(uvWidth * columnIndex, uvHeight * rowIndex);
  imageMap.repeat = new THREE.Vector2(uvWidth, uvHeight);
  imageMap.needsUpdate = true;
  return imageMap;
}

var updateSprites = function(number){
  var group = new THREE.Group();
  //totalMap = texLoader.load('./pic/moment-atlas-test.png');
  //var totalWidth = 4096.0;
  //var totalHeight = 4096.0;
  // var uvWidth = spriteSize.width / totalWidth;
  // var uvHeight = spriteSize.height / totalHeight;
  // var columns = totalWidth / spriteSize.width;
  var fileNameLength = 9;
  for (var i = 0; i < number; i++){
    var filename = i + '.png';
    filename = '0'.repeat(fileNameLength - filename.length) + filename;
    var spriteMap = textureLoader.load('./pic/thumbnails/' + filename);

    //var imageMap = getImageMap(i, uvWidth, uvHeight, columns, totalMap);
    var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap , color: 0xffffff} );
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.position.set( THREE.Math.randFloatSpread( spaceScale ), THREE.Math.randFloatSpread( spaceScale ), THREE.Math.randFloatSpread( spaceScale ));
    sprite.scale.set( imageSize.width, imageSize.height, 1.0 );
    group.add( sprite );
  }
  scene.add(group);
};
