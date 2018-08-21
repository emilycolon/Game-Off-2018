/*
 * Script for index.html
 */

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container', {
  preload: preload,
  create: create,
  update: update
});

// Global variables used throughout the code
// (Phaser 2 doesn't support these in an object!)
var player;
var cursors;
var clouds;
var stars;
var dragon;
var score = 0;
var scoreText;
var music;
var ping;
var dead;

/* Google Webfont code found here:
 * https://github.com/photonstorm/phaser-examples/blob/master/examples/text/google%20webfonts.js 
 */
WebFontConfig = {
  active: function() {
    game.time.events.add(Phaser.Timer.SECOND, createText, this);
  },

  google: {
    families: ['VT323']
  }
};

// This function preloads the items needed to create elements for the game
function preload() {
  //  Load the Google WebFont Loader script
  game.load.script(
    'webfont',
    'https://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js'
  );

  /* Example on using Blur filter found 
   * here: https://phaser.io/examples/v2/filters/blur 
   */
  // Scripts to use Blur filter on pause
  game.load.script(
    'BlurX',
    'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurX.js'
  );

  game.load.script(
    'BlurY',
    'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurY.js'
  );

  // Load images to be used in the game
  game.load.image('sky', 'assets/images/sky.png');
  game.load.image('cloud', 'assets/images/cloud.png');
  game.load.image('star', 'assets/images/star.png');
  game.load.image('dragon', 'assets/images/dragon.png');
  game.load.image('unicorn', 'assets/images/unicorn.png');

  // Load audio to be used in the game
  game.load.audio('song', 'assets/audio/music.mp3');
  game.load.audio('ping', 'assets/audio/star.mp3');
  game.load.audio('dead', 'assets/audio/dead.mp3');
}

// This function creates all of the elements used in the game
function create() {
  // Add background music
  music = game.add.audio('song');

  // Apply game physics
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // Apply world boundaries
  game.physics.setBoundsToWorld();

  // Set background
  game.add.sprite(0, 0, 'sky');

  // Create sound effect elements
  ping = game.add.audio('ping');
  dead = game.add.audio('dead');

  // Create and add clouds
  clouds = game.add.group();
  clouds.enableBody = true;
  var cloud = clouds.create(250, 150, 'cloud');
  cloud.checkWorldBounds = true;
  cloud.events.onOutOfBounds.add(cloudOut, this);
  cloud.body.velocity.y = 100;

  // Create and add Player
  player = game.add.sprite(350, game.world.height - 140, 'unicorn');
  player.scale.setTo(0.8);
  game.physics.arcade.enable(player);
  player.body.gravity.y = 0;
  player.body.collideWorldBounds = true;

  // Create and add Stars (collectables)
  stars = game.add.group();
  stars.enableBody = true;
  for (var i = 0; i < 10; i++) {
    createStar();
  }

  // Create and add Dragon (enemy)
  dragon = game.add.sprite(
    Math.floor(Math.random() * Math.floor(670)),
    0,
    'dragon'
  );
  game.physics.arcade.enable(dragon);
  dragon.body.velocity.setTo(180, 180);
  /* Code example to allow collision with world bound and randomize X/Y gravity 
   * found here: https://phaser.io/examples/v2/sprites/collide-world-bounds
   */
  dragon.body.collideWorldBounds = true;
  dragon.body.gravity.x = game.rnd.integerInRange(-50, 50);
  dragon.body.gravity.y = 20 + Math.random() * 100;
  dragon.body.bounce.setTo(1);

  // Add a input listener to return to game from being paused
  game.input.onDown.add(unpause, self);

  // Assign cursors to variable
  cursors = game.input.keyboard.createCursorKeys();

  // Play background music
  music.loopFull(0.8);
}

// This function creates the text elements of the game after the font has been loaded
function createText() {
  // Add Score Section
  scoreText = game.add.text(16, 16, 'score:');
  scoreText.font = 'VT323';
  scoreText.fontSize = 36;

  /* Code to create pause button created based on code example Pause Menu
   * found here: https://phaser.io/examples/v2/misc/pause-menu 
   */
  pauseLabel = game.add.text(game.world.width - 100, 16, 'pause');
  pauseLabel.font = 'VT323';
  pauseLabel.fontSize = 36;

  pauseLabel.inputEnabled = true;
  pauseLabel.events.onInputUp.add(function() {
    // When the pause button is pressed, pause the game
    game.paused = true;
    blur('add', dragon, player, clouds, stars);
  });
}

// This function runs while the game is being played
function update() {
  dragon.events.onWorldBounds = randomizeDragon();

  // This listens for overlap on the players and stars and runs collectStar()
  game.physics.arcade.overlap(player, stars, collectStar, null, this);

  // This listens for overlap between player and dragon and runs gameOver()
  game.physics.arcade.collide(player, dragon, gameOver, null, this);

  //  Reset the player's velocity (movement)
  player.body.velocity.x = 0;

  if (cursors.left.isDown) {
    //  Move to the left
    player.body.velocity.x = -250;
  } else if (cursors.right.isDown) {
    //  Move to the right
    player.body.velocity.x = 250;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Listener on the "New Game" button
  document.querySelector('a').addEventListener('click', () => {
    location.reload();
  });
});

/* Additional Comments:
 * I tried to split this script up into multiple, shorter JS files; however,
 * Phaser does not support having the preload, create, and update functions
 * in separate files.  Therfore, I was only able to split out my additional
 * functions.
 */

// TODO: Write README

// TODO: GOLD - Audio?
