
//Obsolete
// var getImageMapSprite = function(imgIdx, totalMap){
//   var totalWidth = 4096.0;
//   var totalHeight = 4096.0;
//   var uvWidth = imageSize.width / totalWidth;
//   var uvHeight = imageSize.height / totalHeight;
//   var columns = totalWidth / imageSize.width;
//
//   columnIndex = imgIdx % columns;
//   rowIndex = (imgIdx - columnIndex)/columns;
//   var mapCloned = totalMap.clone();
//   mapCloned.needsUpdate = true;
//   mapCloned.offset = new THREE.Vector2(uvWidth * columnIndex, uvHeight * rowIndex);
//   mapCloned.repeat = new THREE.Vector2(uvWidth, uvHeight);
//   return mapCloned;
// }
//Obsolete
// var updateSprites = function(){
//     var position;
//     var momentObj;
//     var spriteGroup = new THREE.Group();
//     var totalMap = textureLoader.load(spriteSheetPath);
//     var element = {object: null, image: null};
//
//     var jsonFile = new THREE.FileLoader().load(spriteJSONPath,function(data){
//       var jsonObj = JSON.parse(data);
//       number = jsonObj.totalCount;
//       var fileNameLength = 9;
//       for (var i = 0; i < number; i++){
//         position = {
//           //THREE.Math.randFloatSpread( spaceScale ),
//           x: parseFloat(jsonObj[i].position.x)*scaleMultiplier,
//           y: parseFloat(jsonObj[i].position.y)*scaleMultiplier,
//           z: parseFloat(jsonObj[i].position.z)*scaleMultiplier,
//         }
//         momentObj = {
//           index: i,
//           position: position,
//           material: spriteMaterial,
//           width: jsonObj.spriteWidth,
//           height: jsonObj.spriteHeight,
//           uvOffset_u: jsonObj[i].uvOffset_u,
//           uvOffset_v: jsonObj[i].uvOffset_v,
//           uvWidth: jsonObj[i].uvRepeat_u,
//           uvHeight: jsonObj[i].uvRepeat_v
//         }
//
//         //Made some modification in Three.js, adding additional params in Sprite
//         var params = {uvOffset: {u: momentObj.uvOffset_u, v: momentObj.uvOffset_v},
//                       uvRepeat: {u: momentObj.uvWidth, v:momentObj.uvHeight}};
//         var spriteMaterial = new THREE.SpriteMaterial( { map: totalMap, color: 0xffffff} );
//
//         var sprite = new THREE.Sprite( spriteMaterial, params);
//
//         sprite.name = i.toString();
//         sprite.position.set(position.x, position.y, position.z);
//         sprite.scale.set( momentObj.width, momentObj.height, 1.0 );
//         sprite.center = new THREE.Vector2(0.0,0.0);
//         spriteGroup.add( sprite );
//         element.object = sprite;
//         element.image = jsonObj[i].filename;
//         spriteDictionary[i] = element;
//       }
//       interactionObjects.push(spriteGroup);
//       scene.add(spriteGroup);
//     });
// };

var addSprites = function(){
    var position = {x: 0.0, y : 0.0, z: 0.0};
    var momentObj;
    var anchor = new THREE.Vector2(0.5,0.5);
    var totalMap = textureLoader.load(spriteSheetPath);
    var jsonFile = fileLoader.load(spriteJSONPath,function(data){
      var jsonObj = JSON.parse(data);
      number = jsonObj.totalCount;
      positionFile = jsonObj.bin;
      dimensions = jsonObj.dimensions;

      var positionArray = [];
      fileLoader.setResponseType( 'arraybuffer' );
      fileLoader.load(positionFile, function(binary){
         var float32View = new Float32Array(binary);
         for (var i = 0; i < float32View.length; i = i + dimensions) {
           var temp = []
           for (var j = 0; j < dimensions; j++) {
             temp[j] = float32View[i+j] * scaleMultiplier;
           }
           positionArray.push(temp);
         }
         for (var i = 0; i < number; i++){
           momentObj = {
             index: i,
             position: positionArray[i],
             material: spriteMaterial,
             width: jsonObj.spriteWidth,
             height: jsonObj.spriteHeight,
             uvOffset_u: jsonObj[i].uvOffset_u,
             uvOffset_v: jsonObj[i].uvOffset_v,
             uvWidth: jsonObj[i].uvRepeat_u,
             uvHeight: jsonObj[i].uvRepeat_v
           }
           imageWidth = jsonObj.spriteWidth;
           imageHeight = jsonObj.spriteHeight;
           //Made some modification in Three.js, adding additional params in Sprite
           var params = {uvOffset: {u: momentObj.uvOffset_u, v: momentObj.uvOffset_v},
                         uvRepeat: {u: momentObj.uvWidth, v:momentObj.uvHeight}};
           var spriteMaterial = new THREE.SpriteMaterial( { map: totalMap, color: 0xffffff} );

           var sprite = new THREE.Sprite( spriteMaterial, params);

           sprite.name = i.toString();
           //Assuming dimensions >= 2
           if (momentObj.position.length <= 2)
           {
             sprite.position.set(momentObj.position[0], momentObj.position[1], 0.0);
           } else {
             sprite.position.set(momentObj.position[0], momentObj.position[1], momentObj.position[2]);
           }
           sprite.center = anchor;
           sprite.material.transparent = true;
           sprite.material.opacity = 1;
           sprite.scale.set( momentObj.width/momentObj.height, 1.0, 1.0 );
           spriteGroup.add( sprite );
           spriteDictionary[i] = {
             object: sprite,
             image: jsonObj[i].filename,
             label: 'Moment Index: ' + i.toString(),
             game: game,
             corpus: corpus,
             labelSprite: null //reserved for metalabel shown when this sprite is clicked
           };
         }
         interactionObjects.push(spriteGroup);
         scene.add(spriteGroup);

       }); //end of fileLoader.load
    }); //end of jsonFile.load
};
