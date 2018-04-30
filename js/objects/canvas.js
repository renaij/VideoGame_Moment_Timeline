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

function generate_label(sprite, jumpToTarget = false) {
  //If metalabel for this sprite already exists:
  if (sprite.labelSprite != null)
  {
    sprite.labelSprite.position.set(sprite.object.position.x, sprite.object.position.y, sprite.object.position.z);
    sprite.labelSprite.scale.set(wrapper_margin, canvas_height / canvas_width * wrapper_margin, 1.0);
    sprite.labelSprite.material.transparent = true;
    sprite.labelSprite.material.opacity = 1;
    makeVisible(sprite.labelSprite);
    makeInvisible(sprite.object);
    if (jumpToTarget) {
      jump(sprite.labelSprite);
    }
    return;
  }
  var imageFile =  imagePath + sprite.image;
  imageLoader.load(
  	imageFile,
  	function ( image ) {
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
      ctx.fillText('top', left_margin, frame_top + textbox_height);
      var titlePos = canvas_height / 2.0 + frame_top - textbox_height/2;
      ctx.fillText(sprite.game, left_margin, titlePos);
      titlePos += textbox_height * 2;
      ctx.fillText(sprite.corpus, left_margin, titlePos);
      titlePos += textbox_height * 2;
      ctx.fillText(sprite.label, left_margin, titlePos);
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

      var spriteMaterial = new THREE.SpriteMaterial( { map: texture, color: 0xffffff} );
      sprite.labelSprite = new THREE.Sprite(spriteMaterial);
      sprite.labelSprite.name = "label_" + sprite.object.name;
      sprite.labelSprite.center = canvas_anchor;
      sprite.labelSprite.position.set(sprite.object.position.x, sprite.object.position.y, sprite.object.position.z);
      sprite.labelSprite.scale.set(1.0 * wrapper_margin, canvas_height / canvas_width * wrapper_margin, 1.0);
      sprite.labelSprite.material.transparent = true;
      sprite.labelSprite.material.opacity = 1;
      makeVisible(sprite.labelSprite);
      scene.add(sprite.labelSprite);
      makeInvisible(sprite.object);

      if (jumpToTarget) {
        jump(sprite.labelSprite);
      }
	});
}
