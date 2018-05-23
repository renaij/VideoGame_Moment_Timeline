var bookmarkList=[];
var bookmarksDict={};
var numberOfPages=0;
var currentPage=0;

function addBookmark(momentId) {
  if (!bookmarks.hasOwnProperty(momentId)){
    numberOfPages += 1;
    currentPage = numberOfPages - 1;
    bookmarksDict[momentId] = numberOfPages-1;
    bookmarkList[numberOfPages-1] = momentId;
  }
}
function getLastBookmark() {
  var momentId = null;
  if (currentPage > 0){
    currentPage -= 1;
  }
  if (currentPage < 0) {
    currentPage = 0;
  } else {
    momentId = bookmarkList[currentPage];
  }
  return momentId;
}
function getNextBookmark() {
  var momentId = null;
  if (currentPage < numberOfPages-1)
  {
    currentPage += 1;
  }
  if (currentPage > numberOfPages-1) {
    currentPage = numberOfPages-1;
  } else {
    momentId = bookmarkList[currentPage];
  }
  return momentId;
}
function showBookmarkLabels() {
  for (var i=0; i<bookmarkList.length;i++){
    showLabel(spriteDictionary[bookmarkList[i]], 2.0);
    if (i == 0 ){
      flyToTarget(spriteDictionary[bookmarkList[i]].object);
    }
  }
}
function hideBookmarkLabels() {
  for (var key in bookmarksDict){
    hideLabel(spriteDictionary[key]);
  }
}
function getBookmarks() {
  return bookmarkList;
}
