var listener = new THREE.AudioListener();
var soundOnSelect = new THREE.Audio( listener );
var soundOnClick = new THREE.Audio( listener );
var soundOnNext = new THREE.Audio( listener ); //variables on UI sounds
var Music = new THREE.Audio( listener );
var audioLoader = new THREE.AudioLoader();

function initAudio() {
  expectedActions += 1;
  audioLoader.load( 'sound/BackgroundMusic.mp3', function( buffer ) {
    Music.setBuffer( buffer );
    Music.setLoop( false );
    Music.setVolume( 0.3 );
    Music.play();//backgroundmusic
    actionCounter += 1;
  });
  expectedActions += 1;
  audioLoader.load( 'sound/OnClick.mp3', function( buffer ) {
    soundOnClick.setBuffer( buffer );
    soundOnClick.setLoop( false );
    soundOnClick.setVolume( 0.3 );
    actionCounter += 1;
  });
  expectedActions += 1;
  audioLoader.load( 'sound/OnSelect.mp3', function( buffer ) {
    soundOnSelect.setBuffer( buffer );
    soundOnSelect.setLoop( false );
    soundOnSelect.setVolume( 0.3 );
    actionCounter += 1;
  });
  expectedActions += 1;
  audioLoader.load( 'sound/OnNext.mp3', function( buffer ) {
    soundOnNext.setBuffer( buffer );
    soundOnNext.setLoop( false );
    soundOnNext.setVolume( 0.3 );
    actionCounter += 1;
	});//sound for next page
}
function playSound(object) {
  object.play();
}
