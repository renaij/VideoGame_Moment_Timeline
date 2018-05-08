var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var spaceScale = 500.0;
var scaleMultiplier = 10.0 ;//100.0;
var flyingDuration = 500;
var FLY_STOP_DISTANCE = 2.0;
var spriteJSONPath = './pic/Super Mario World (USA)_3D.json';
var adjacentMoments = 20;
var autoRotateSpeed = 0.05;
var fileLoader = new THREE.FileLoader();
var textureLoader = new THREE.TextureLoader();
var imageLoader = new THREE.ImageLoader();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var floating_div = document.getElementById('float_div');
var FLOATING_DIV_RIGHT = floating_div.offsetLeft + floating_div.clientWidth;
var FLOATING_DIV_BOTTOM = floating_div.offsetTop + floating_div.clientHeight;
var gameSelections = {
  "Super Mario World (USA)": {
    "2D": "./pic/Super Mario World (USA)_2D.json",
    "3D": "./pic/Super Mario World (USA)_3D.json"
  },
  "7th Saga, The (USA)": {
    "2D": "./pic/The 7th Saga (USA)_2D.json",
    "3D": "./pic/The 7th Saga (USA)_3D.json",
  }
}
