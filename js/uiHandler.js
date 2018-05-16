function showPage() {
  $("#loading-scene").fadeOut(1000);
  document.getElementById("container").style.display = "block";
  //document.getElementById("float_div").style.display = "block";
  document.getElementById("top_bar").style.display = "block";
  document.getElementById("bottomright-bar").style.display = "block";
}
function loadingScene() {
  if ((actionCounter == expectedActions) && (!isPageShown))
  {
    addCorporaButtons();
    cameraReady();
    showPage();
    isPageShown = true;
  }
}
function addGameInfo(game) {
  $('#game-info').text(game);
}
function addCorporaButtons(){
  var idx = 0;
  for (corpus in spriteGroups){
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
    // var children = $('#corpora_bar').children();
    // for (var i = 0; i < children.length; i++) {
    //
    // }
  }
}
function onShowBookmarkBar(id){
  var isClicked = $('#' + id).hasClass("button-clicked");
  if (isClicked) {
    $('#bookmark-btn').switchClass('button-clicked', 'button','fast');
  } else {
    $('#bookmark-btn').switchClass('button', 'button-clicked','fast');
    // var children = $('#corpora_bar').children();
    // for (var i = 0; i < children.length; i++) {
    //
    // }
  }
}
function onShowCorpus(id){
  var group = id.substr(0, id.lastIndexOf("-btn"));
  var isClicked = $('#' + id).hasClass("button-sm-clicked");
  if ( isClicked ) {
    $('#' + id).switchClass('button-sm-clicked', 'button-sm','fast');
    //Hide corpus
    toggleSpriteGroup(group, false);
    toggleGroupRaycasting(group,false);
  } else {
    $('#' + id).switchClass('button-sm', 'button-sm-clicked','fast');
    //Show corpus
    toggleSpriteGroup(group, true);
    toggleGroupRaycasting(group,true);
  }
}
