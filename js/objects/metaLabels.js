var textbox_height = 14;
var canvas_width = 256;
var canvas_height = 512;
var left_margin = 15;
var image_width = canvas_width - 2 * left_margin;
var image_height= 224 * image_width / canvas_width;
var tmp_canvas = null;
var ctx = null;
var wrapper_margin = 1.3; // this will affect all margins
var frame_top = canvas_height * 0.275; // 0.073;   // this tunes y / top margin
var frame_bottom = canvas_height * 0.925;
var canvas_anchor = new THREE.Vector2(0.5,0.5);

function resize(size)
{
  var pos =  Math.ceil(Math.log2(nSize));  //(ceiling of log n with base 2)
  return Math.pow(2, pos);
}
function showNearbyLabels(targetId, animation = false){
  //startingTime = performance.now();
  lastSelected.object = spriteDictionary[targetId].object;
  currentTarget = targetId;
  var totalNumber = Object.keys(spriteDictionary).length;
  var start = targetId - ADJACENT_MOMENTS;
  var stop = targetId + ADJACENT_MOMENTS;
  if (start < -1)
  {
    start = 0;
  }
  if (stop >  totalNumber - 1)
  {
    stop = totalNumber - 1
  }
  for (var n = 0; n < totalNumber; n++)
  {
    var spriteId = Number(spriteDictionary[n].object.name);
    if (spriteId < start || spriteId > stop)
    {
      spriteDictionary[n].object.material.opacity = OPACITY_FOR_HIDING;
      hideLabel(spriteId);
    } else if (spriteId == targetId) {
      continue;
    } else {
      //Show detailed views and hide low-res views
      showLabel(spriteId, animation);
    }
  }
  showLabel(targetId, animation);
}
function showLabel(spriteId, animation = false) {
  if (!metalabelDictionary.hasOwnProperty(spriteId))
  {
    _createLabel(spriteId, animation);
  } else {
    //Jump straight to target if metalabel for this sprite already exists:
    var sprite = spriteDictionary[spriteId].object; //get the corresponding sprite object
    metalabelDictionary[spriteId].labelSprite.position.set(sprite.position.x, sprite.position.y, sprite.position.z);
    metalabelDictionary[spriteId].labelSprite.scale.set(wrapper_margin, canvas_height / canvas_width * wrapper_margin, 1.0);
    metalabelDictionary[spriteId].labelSprite.material.transparent = true;
    metalabelDictionary[spriteId].labelSprite.material.opacity = 1;
    makeVisible(metalabelDictionary[spriteId].labelSprite); //show metaLabel
    makeInvisible(sprite); //hide sprite
    if (spriteId == currentTarget) {
      flyToTarget(metalabelDictionary[spriteId].labelSprite, animation);
    }
  }
}
function hideLabel(spriteId) {
  //Jump straight to target if metalabel for this sprite already exists:
  if (metalabelDictionary.hasOwnProperty(spriteId))
  {
    var sprite = spriteDictionary[spriteId].object; //get the corresponding sprite object
    metalabelDictionary[spriteId].labelSprite.position.set(sprite.position.x, sprite.position.y, sprite.position.z);
    metalabelDictionary[spriteId].labelSprite.scale.set(wrapper_margin, canvas_height / canvas_width * wrapper_margin, 1.0);
    metalabelDictionary[spriteId].labelSprite.material.transparent = true;
    metalabelDictionary[spriteId].labelSprite.material.opacity = 1;
    makeInvisible(metalabelDictionary[spriteId].labelSprite);
    makeVisible(sprite);
    return;
  }
}
function _createLabel(spriteId, animation = false) {
  if (metalabelDictionary.hasOwnProperty(spriteId))
  {
    return;
  }
  var imageFile =  spriteDictionary[spriteId].image;
  imageLoader.load(
  	imageFile,
  	function ( image ) {
      momentIndex = spriteDictionary[spriteId].momentIndex;
      game = spriteDictionary[spriteId].game;
      corpusName = spriteDictionary[spriteId].corpus;
      numberPerCorpus = spriteGroups[corpusName].children.length;
      label = 'Moment Index: ' + momentIndex.toString() + ' / ' + numberPerCorpus.toString();
      metalabelDictionary[spriteId] = {};
      var targetSprite = spriteDictionary[spriteId].object;
      if (tmp_canvas == null) {
        tmp_canvas = document.createElement("canvas");
        tmp_canvas.width = canvas_width;
        tmp_canvas.height = canvas_height;
        ctx = tmp_canvas.getContext("2d");
        ctx.font = textbox_height + "px Arial";
        ctx.textAlign = "left"
      } else {
        ctx.clearRect(0.0, 0.0, canvas_width, canvas_height);
      }
      // redraw
      ctx.fillStyle = "white";
      ctx.fillRect(0.0, frame_top, canvas_width, frame_bottom - frame_top); //canvas_height
      //ctx.strokeRect(0.0, frame_top, canvas_width, frame_bottom - frame_top);
      ctx.fillStyle = "black";
      //ctx.fillText('top', left_margin, frame_top + textbox_height);
      var titlePos = canvas_height / 2.0 + frame_top - textbox_height/2;
      ctx.fillText("Game: " + game, left_margin, titlePos);
      titlePos += textbox_height * 1.5;
      ctx.fillText("Corpus: " + corpusName, left_margin, titlePos);
      titlePos += textbox_height * 1.5;
      ctx.fillText(label, left_margin, titlePos);
      titlePos += textbox_height * 1.5;
      ctx.fillText("Global ID: " + spriteId, left_margin, titlePos);
      //ctx.fillText("bottom", left_margin, canvas_height / 2.0 + frame_top - textbox_height/2);

  		ctx.drawImage(image, left_margin, frame_top + textbox_height, image_width, image_height);
      //Adding a sprite with canvas as its texture
      var carry_over = document.createElement("canvas");
      carry_over.width = canvas_width;
      carry_over.height = canvas_height;
      var carry_context = carry_over.getContext("2d");
      carry_context.drawImage(tmp_canvas, 0, 0);

      var texture = new THREE.Texture(carry_over);
      texture.minFilter = texture.magFilter = THREE.NearestFilter;
      texture.needsUpdate = true;
      if (metalabelDictionary[spriteId].labelSprite != null || metalabelDictionary[spriteId].labelSprite != undefined)
      {
        delete metalabelDictionary[spriteId].labelSprite;
      }
      var spriteMaterial = new THREE.SpriteMaterial( { map: texture, color: 0xffffff} );
      var labelSprite = new THREE.Sprite(spriteMaterial);
      labelSprite.center = canvas_anchor;
      labelSprite.position.set(targetSprite.position.x, targetSprite.position.y, targetSprite.position.z);
      labelSprite.scale.set(wrapper_margin, canvas_height / canvas_width * wrapper_margin, 1.0);
      labelSprite.material.transparent = true;
      labelSprite.material.opacity = 1;
      labelSprite.name = "label_" + spriteId.toString();
      //indexing every metaLabel
      metalabelDictionary[spriteId] = {
        label: label,
        labelSprite: labelSprite //reserved for metalabel shown when this sprite is clicked
      };
      scene.add(labelSprite);
      makeVisible(labelSprite);
      makeInvisible(targetSprite);
      if (spriteId == currentTarget) {
        flyToTarget(labelSprite, animation);
      }
	});
}
function showLabelsInRange(distance) {
  getFrustrum();
  for (var corpus in interactionObjects){
    for (var i=0; i<interactionObjects[corpus].children.length; i++){
      var spriteObj = interactionObjects[corpus].children[i];
      if (isInCameraView(spriteObj) ){
        if (distanceToCamera(spriteObj) <= distance) {
          showLabel(Number(spriteObj.name));
        }
      }
    }
  }
}
