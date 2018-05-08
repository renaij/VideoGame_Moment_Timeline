var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var spaceScale = 400.0;
var scaleMultiplier = 10.0 ;//100.0;
var flyingDuration = 1000;
var FLY_STOP_DISTANCE = 2.0;
var spriteJSONPath = './pic/Super Mario World (USA).json';
var adjacentMoments = 20;
var autoRotateSpeed = 0.05;
var fileLoader = new THREE.FileLoader();
var textureLoader = new THREE.TextureLoader();
var imageLoader = new THREE.ImageLoader();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
// var spriteGroup = new THREE.Group();

function step_a(file) {
  fileLoader.load(file, function(data) {
      console.log('Test 1' + file);
  })
}

class theHandler {
  constructor(initial_data) {
    this.data = initial_data;
  };
  func(fileContent) {
    console.log('Test 3 ' + this.data);
  }
};

step_a('./pic/supermarioworld3_700.bin');
step_a('./pic/Super Mario World (USA)/algorithm.bin');
step_a('./pic/Super Mario World (USA)/human.bin');

file = './pic/supermarioworld3_700.bin';
fileLoader.load(file, function(data) {
    console.log('Test 2' + file);
})
file = './pic/Super Mario World (USA)/algorithm.bin';
fileLoader.load(file, function(data) {
    console.log('Test 2' + file);
})
file = './pic/Super Mario World (USA)/human.bin';
fileLoader.load(file, function(data) {
    console.log('Test 2' + file);
})

file = './pic/supermarioworld3_700.bin';
fileLoader.load(file, new theHandler(file).func());

file = './pic/Super Mario World (USA)/algorithm.bin';
fileLoader.load(file, new theHandler(file).func());

file = './pic/Super Mario World (USA)/human.bin';
fileLoader.load(file, new theHandler(file).func());
