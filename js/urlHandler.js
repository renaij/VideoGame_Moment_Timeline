var bookmarks = {};
var urlParams = {game: null, corpora: null, dimension: null, moment_id: null, position: null, bookmarks: null}; //latest url
var URLKeys = {
  MOMENT: "moment_id",
  POSITION: "position",
  CORPORA: "corpora",
  GAME: "game",
  BOOKMARK: "bookmarks",
  DIMENSION: "dimension"
}
// tsnemap.html#game=metroid;corpora=algorithm,human;moment_id=555;position=5,6,2
function _getUrlString(params) {
  var urlString = "#";
  var stringParams = {}
  // only process recognized keys
  if (URLKeys.GAME in params) { stringParams[URLKeys.GAME] = params[URLKeys.GAME]; };
  if (URLKeys.CORPORA in params && params[URLKeys.CORPORA] != null) {
    stringParams[URLKeys.CORPORA] = params[URLKeys.CORPORA].join(',');
  }
  else {
    urlParams[URLKeys.CORPORA] = null;
  };
  if (URLKeys.DIMENSION in params) {stringParams[URLKeys.DIMENSION] = params[URLKeys.DIMENSION]};
  if (URLKeys.MOMENT in params) {stringParams[URLKeys.MOMENT] = params[URLKeys.MOMENT]};
  if (URLKeys.POSITION in params) {
    stringParams[URLKeys.POSITION] = params[URLKeys.POSITION].join(',');
  };
  if (URLKeys.BOOKMARK in params) {
    stringParams[URLKeys.BOOKMARK] = params[URLKeys.BOOKMARK].join(',');
  };
  for (key in stringParams) {
    urlString += key + "=" + stringParams[key] + ';'
  }
  return urlString;
}
function getRootURL() {
  return window.location.host + window.location.pathname ;
}
function getCurrentURL() {
  return window.location.href;;
}
function _updateUrlParams() {
  urlParams = parseURL(getCurrentURL());
}

function _writeURL(urlString) {
  history.replaceState({},"",urlString);
}

function updateURL(key, value=null) {
  _updateUrlParams();
  if (key == URLKeys.POSITION) {
    urlParams[URLKeys.POSITION] = value;
  } else {
    urlParams[URLKeys.POSITION] = camera.position.toArray();
  }
  if (key == URLKeys.CORPORA) {
    urlParams[URLKeys.CORPORA] = value;
  } else {
    urlParams[URLKeys.CORPORA] = Object.keys(interactionObjects);
  }
  if (key == URLKeys.MOMENT) {
    urlParams[URLKeys.MOMENT] = value;
  }
  if (key == URLKeys.BOOKMARK) {
    urlParams[URLKeys.BOOKMARK] = value;
  }
  var urlString = _getUrlString(urlParams);
  _writeURL(urlString);
}

function parseURL(url) {
  paramsString = url.substr(url.indexOf('#'));
  paramsArr = paramsString.replace('#', '').replace(/%20/g, ' ').split(';');
  params = {};

  for (i in paramsArr) {
    itemArr = paramsArr[i].split('=');
    if (itemArr.length > 1) {
      if (itemArr[1].indexOf(',') != -1) {
        params[itemArr[0]] = itemArr[1].split(',');
      } else {
        params[itemArr[0]] = itemArr[1];
      }
    }
  }
  if (params[URLKeys.POSITION] != undefined || params[URLKeys.POSITION] != null ){
    var floatArray = [];
    for (var i = 0; i < params[URLKeys.POSITION].length; i++)
    {
      floatArray[i] = parseFloat(params[URLKeys.POSITION][i]); //convert string to float
    }
    params[URLKeys.POSITION] = floatArray;
  }
  return params;
}
function getBookmarkUrl(){

}
