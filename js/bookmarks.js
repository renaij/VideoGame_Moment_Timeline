var bookmarks = [];
var numberOfPages = 0;
var currentPage = 0;

function addBookmark(momentId, url) {
  numberOfPages += 1;
  currentPage = numberOfPages - 1;
  bookmarks[numberOfPages-1] = {momentId: momentId, url: url};
}
function getLastBookmark() {
  var url = null;
  if (currentPage > 0){
    currentPage -= 1;
  }
  if (currentPage < 0) {
    currentPage = 0;
  } else {
    url = bookmarks[currentPage].url;
  }
  return url;
}
function getNextBookmark() {
  var url = null;
  if (currentPage < numberOfPages-1)
  {
    currentPage += 1;
  }
  if (currentPage > numberOfPages-1) {
    currentPage = numberOfPages-1;
  } else {
    url = bookmarks[currentPage].url;
  }
  return url;
}
