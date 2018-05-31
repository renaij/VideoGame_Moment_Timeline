function showPage() {
  $("#loading-scene").fadeOut(1000);
  document.getElementById("container").style.display = "block";
  //document.getElementById("float_div").style.display = "block";
  document.getElementById("top_bar").style.display = "block";
  document.getElementById("bottomright-bar").style.display = "block";
}

function addGameInfo(game) {
  $('#game-info').text(game);
}
function addCorporaButtons(){
  var idx = 0;
  for (corpus in spriteManager.spriteGroups){
    var id = corpus + "-btn";
    var wrapper = id + "-wrapper";
    $('#corpora_bar').prepend("<div id='" + wrapper + "'></div>");
    $('#' + wrapper).prepend("<button class='button-sm button-sm-clicked' id='" + id + "' onclick='onShowCorpus(this.id)'>" + corpus + "</button>");
    height = 5;
    gap = 5;
    pct = gap + (gap+height)*idx;
    $('#' + wrapper).css("position", "absolute");
    $('#' + wrapper).css("top", pct+"%");
    $('#' + wrapper).css("left", "15%");
    $('#' + wrapper).css("width", "70%");
    $('#' + wrapper).css("height", height+"%");
    $('#' + id).css("position", "absolute");
    $('#' + id).css("height", "100%");
    $('#' + id).css("width", "100%");
    idx ++;
  }
}
function onShowCorporaBar(id) {
  var isClicked = $('#' + id).hasClass("button-clicked");
  if (isClicked) {
    //document.getElementById("float_div").style.display = "none";
    document.getElementById("corpora_bar").style.display = "none";
    $('#corpora-btn').switchClass('button-clicked', 'button','fast');
  } else {
    //document.getElementById("float_div").style.display = "block";
    document.getElementById("corpora_bar").style.display = "block";
    $('#corpora-btn').switchClass('button', 'button-clicked','fast');
  }
}
function onShowBookmarkBar(id){
  var isBkmkBtnClicked = $('#' + id).hasClass("button-clicked");
  if (isBkmkBtnClicked) {
    $('#bookmark-btn').switchClass('button-clicked', 'button','fast');
    bookmarkManager.hideBookmarkLabels();
    //Add time div
  } else {
    $('#bookmark-btn').switchClass('button', 'button-clicked','fast');
    //Show bookmarks
    bookmarkManager.showBookmarkLabels();
    //Hide time div
  }
}
function onShowCorpus(id){
  var group = id.substr(0, id.lastIndexOf("-btn"));
  var isCorpusBtnClicked = $('#' + id).hasClass("button-sm-clicked");
  if ( isCorpusBtnClicked ) {
    $('#' + id).switchClass('button-sm-clicked', 'button-sm','fast');
    //Hide corpus
    spriteManager.toggleSpriteGroup(group, false);
    spriteManager.toggleGroupRaycasting(group,false);
  } else {
    $('#' + id).switchClass('button-sm', 'button-sm-clicked','fast');
    //Show corpus
    spriteManager.toggleSpriteGroup(group, true);
    spriteManager.toggleGroupRaycasting(group,true);
  }
}
function onShowAnimationBar(id) {
  var isAnimationBtnClicked = $('#' + id).hasClass("button-clicked");
  if ( isAnimationBtnClicked ) {
    $('#' + id).switchClass('button-clicked', 'button','fast');
    document.getElementById("animation_bar").style.display = "none";
  } else {
    $('#' + id).switchClass('button', 'button-clicked','fast');
    document.getElementById("animation_bar").style.display = "block";

  }
}

//Make the DIV element draggagle:
dragElement(document.getElementById(("animation_bar")));
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function onPlay(id) {
  if (id == "playpause-btn") {
    startId = Number(document.getElementById('startId').value);
    stopId = Number(document.getElementById('stopId').value);
    element = document.getElementById('playpause');
    if ( element.innerText == "play_circle_outline") {
      element.innerText = "pause_circle_outline";
      //pause animation
      animationPlaying = false;
    } else {
      element.innerText = "play_circle_outline";
      //play animation
      animationPlaying = true;
    }
  }
}

function animation(startId, stopId) {
  autoRotate = false;
  for (var i = startId; i <= stopId; i++) {
    if (animationPlaying) {
      labelManager.showNearbyLabels(i, 0);
      urlManager.updateURL(URLKeys.MOMENT, i);
    }
  }
}
