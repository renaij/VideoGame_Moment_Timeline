var bookmarks = {};
var urlParams = {game: null, corpora: null, dimension: null, moment_id: null, position: null};

// tsnemap.html#game=metroid;corpora=algorithm,human;moment_id=555;position=5,6,2
function getUrlString(params) {
  var urlString = "#";

  // only process recognized keys
  if ('game' in params) { urlParams['game'] = params['game']; };
  if ('corpora' in params) { urlParams['corpora'] = params['corpora'].join(','); };
  if ('dimension' in params) {urlParams['dimension'] = params['dimension']};
  if ('moment_id' in params) {urlParams['moment_id'] = params['moment_id']};
  if ('position' in params) {
    urlParams['position'] = params['position'].join(',');
  };

  for (key in urlParams) {
    urlString += key + "=" + urlParams[key] + ';'
  }
  return urlString;
}
function getRootURL() {
  return history;
}

function writeURL(urlString) {
  history.replaceState({},"",urlString);
}

function updateURL(momentId) {
  //url manipulation example
  var params = {};
  params['corpora'] = [];
  if (document.getElementById("human_check") != null){
    params['corpora'].push("human");
  }
  if (document.getElementById("algorithm_check") != null){
    params['corpora'].push("algorithm");
  }
  if (document.getElementById("expert_check") != null){
    params['corpora'].push("expert");
  }
  if (document.getElementById("attractmode_check") != null){
    params['corpora'].push("attractmode");
  }
  params['moment_id'] = momentId;
  params['position'] = camera.position.toArray();
  params['game'] = initParams['game'];
  params['dimension'] = initParams['dimension'];
  var urlString = getUrlString(params);
  writeURL(urlString);
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
  if (params['position'] != undefined || params['position'] != null ){
    var floatArray = [];
    for (var i = 0; i < params['position'].length; i++)
    {
      floatArray[i] = parseFloat(params['position'][i]); //convert string to float
    }
    params['position'] = floatArray;
  }
  return params;
}
