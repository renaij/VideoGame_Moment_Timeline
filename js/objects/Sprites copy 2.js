var anchor = new THREE.Vector2(0.5,0.5);

var addSpritesToScene = function(corpusName, numberBase, dataObj){
  console.log("enter " + corpusName);
  var game = dataObj.game;
  var corpus = dataObj.corpusName;
  var screenshotsFolder = dataObj.screenshots_folder;
  var embeddingsFolder = dataObj.embeddings_folder;
  var basePath = dataObj["corpus"][corpusName];
  var jsonObj = dataObj[corpusName];

  var number = jsonObj.totalCount;
  var positionFile = jsonObj.positions.bin;
  var dimensions = jsonObj.positions.dimensions;
  var spriteSheetPath = jsonObj.spriteSheetPath;
  // var binary = fileLoader.load(positionFile);
  var totalMap = textureLoader.load(spriteSheetPath);

  var positionArray = [];
  fileLoader.setResponseType( 'arraybuffer' );
  fileLoader.load(positionFile, function(binary) {
    console.log('Enter' + corpusName + '-' + positionFile + 'numbase' + numberBase);
    var float32View = new Float32Array(binary);
    for (var i = 0; i < float32View.length; i = i + dimensions) {
      var temp = []
      for (var j = 0; j < dimensions; j++) {
        temp[j] = float32View[i+j] * scaleMultiplier;
      }
      positionArray.push(temp);
    }

    for (var i = 0; i < number; i++){
      var totalIndex = i + numberBase;
      //Made some modification in Three.js, adding additional params in Sprite
      var params = {
        uvOffset: {
          u: jsonObj.spritesheet[i].uvOffset_u,
          v: jsonObj.spritesheet[i].uvOffset_v
        },
        uvRepeat: {
          u: jsonObj.spritesheet[i].uvRepeat_u,
          v: jsonObj.spritesheet[i].uvRepeat_v
        }
      };
      var spriteMaterial = new THREE.SpriteMaterial( { map: totalMap, color: 0xffffff} );
      var sprite = new THREE.Sprite( spriteMaterial, params);
      //Assuming dimensions >= 2
      if (positionArray[i].length <= 2)
      {
        sprite.position.set(positionArray[i][0], positionArray[i][1], 0.0);
      } else {
        sprite.position.set(positionArray[i][0], positionArray[i][1], positionArray[i][2]);
      }
      sprite.name = totalIndex.toString();
      sprite.center = anchor;
      sprite.material.transparent = true;
      sprite.material.opacity = 1;
      sprite.scale.set( jsonObj.spriteWidth/jsonObj.spriteHeight, 1.0, 1.0 );
      spriteGroup.add( sprite );

      //indexing every sprite
      spriteDictionary[totalIndex] = {
        object: sprite,
        image:  basePath + '/' + screenshotsFolder + '/' + jsonObj.spritesheet[i].filename,
        label: 'Moment Index: ' + i.toString(),
        game: game,
        corpus: corpus,
        labelSprite: null //reserved for metalabel shown when this sprite is clicked
      };
    } // for i in position
    //Add groups for raycasting
    interactionObjects.push(spriteGroup);
    scene.add(spriteGroup);
    //indexing each corpus as a group
    spriteGroups[corpusName] = spriteGroup;
    numberBase += number;
    console.log("End " + corpusName + '-' + positionFile + 'numbase' + numberBase);
  });  //end of fileLoader.load
}

var addMoments = function(){
  //Read JSON file
  fileLoader.load(spriteJSONPath, function (data) {
    var jsonData = JSON.parse(data);
    var numberBase = 0;
    //corpora iteration
    for (var corpusName in jsonData.corpus) {
      numberBase = addSpritesToScene(corpusName, numberBase, jsonData);
    }; // end of for each corpusName
  });
};
