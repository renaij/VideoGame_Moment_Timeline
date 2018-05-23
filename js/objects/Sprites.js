var anchor = new THREE.Vector2(0.5,0.5);
var dataPool = {};

var addSpritesToScene = function(corpusName, numberBase, dataObj){
  var game = dataObj.game;
  var screenshotsFolder = dataObj.screenshots_folder;
  var embeddingsFolder = dataObj.embeddings_folder;
  var basePath = dataObj["corpus"][corpusName];
  var jsonObj = dataObj[corpusName];

  var number = jsonObj.totalCount;
  var positionFile = jsonObj.positions.bin;
  var dimensions = jsonObj.positions.dimensions;
  var spriteSheetPath = jsonObj.spriteSheetPath;
  expectedActions += 1;
  var totalMap = textureLoader.load(spriteSheetPath, function() {
    dataPool[corpusName]['texture'] = totalMap.clone();  
    actionCounter += 1;
  });
  dataPool[corpusName]['UVs'] = {};

  expectedActions += 1;
  fileLoader.setResponseType( 'arraybuffer' );
  fileLoader.load(positionFile, function(binary) {
    var spriteGroup = new THREE.Group();
    var positionArray = [];
    var float32View = new Float32Array(binary);
    for (var i = 0; i < float32View.length; i = i + dimensions) {
      var temp = []
      for (var j = 0; j < dimensions; j++) {
        temp[j] = float32View[i+j] * scaleMultiplier;
      }
      positionArray.push(temp);
    }
    for (var i = 0; i < number; i++){
      var totalIndex = i + numberBase.val;
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
      dataPool[corpusName]['UVs'][totalIndex] = params;
      var spriteMaterial = new THREE.SpriteMaterial( { map: totalMap, color: 0xffffff} );
      var sprite = new THREE.Sprite( spriteMaterial, params);

      if (positionArray[i].length <= 2)
      {
        sprite.position.set(positionArray[i][0], 0.0, positionArray[i][1]); //2D
      } else {
        sprite.position.set(positionArray[i][0], positionArray[i][1], positionArray[i][2]); //3D
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
        label: 'Moment Index: ' + i.toString() + ' / ' + (number-1).toString(),
        game: game,
        corpus: corpusName,
        labelSprite: null //reserved for metalabel shown when this sprite is clicked
      };
    } // for i in position
    //Add groups for raycasting
    interactionObjects[corpusName] = spriteGroup;
    //indexing each corpus as a group
    spriteGroups[corpusName] = spriteGroup;
    numberBase.val += number; //Counter for globalID
    scene.add(spriteGroup);
    actionCounter += 1;
  });  //end of fileLoader.load
}

var addSprites = function(){
  expectedActions += 1;
  //Read JSON file
  fileLoader.load(spriteJSONPath, function (data) {
    var jsonData = JSON.parse(data);
    var numberBase = {val: 0};

    //corpora iteration
    for (var corpusName in jsonData.corpus) {
      dataPool[corpusName] = {};
      addSpritesToScene(corpusName, numberBase, jsonData);
    }; // end of for each corpusName
    actionCounter += 1;
  });
};
var enableSpritesInteractions = function(){
  while (interactionObjects.length > 0) {interactionObjects.pop();}
  for (corpus in spriteGroups)
  {
    if (document.getElementById(corpus + "_check").checked)
    {
      interactionObjects.push(spriteGroups[corpus]);
    }
  }
}
function toggleGroupRaycasting(corpus,enabled){
  if (enabled){
    interactionObjects[corpus] = spriteGroups[corpus];
  } else {
    delete interactionObjects[corpus];
  }
}
function toggleSpriteGroup(corpus, enabled) {
  if (enabled) {
    opacity = 1.0;
  } else {
    opacity = OPACITY_FOR_HIDING;
  }
  for (var i = 0; i < spriteGroups[corpus].children.length; i++)
  {
    spriteGroups[corpus].children[i].material.opacity = opacity;
  }
}
