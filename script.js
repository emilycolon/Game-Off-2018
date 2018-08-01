var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container', {
  preload: preload,
  create: create,
  update: update
});

// Google Webfont code found here: https://github.com/photonstorm/phaser-examples/blob/master/examples/text/google%20webfonts.js
WebFontConfig = {
  //  'active' means all requested fonts have finished loading
  //  1 second delay before calling 'createText' or the browser cannot render the text the first time it's created.
  active: function() {
    game.time.events.add(Phaser.Timer.SECOND, createText, this);
  },

  //  The Google Fonts we want to load
  google: {
    families: ['VT323']
  }
};

function preload() {
  //  Load the Google WebFont Loader script
  game.load.script(
    'webfont',
    'https://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js'
  );

  // Scripts to use Blur filter on pause
  game.load.script(
    'BlurX',
    'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurX.js'
  );
  game.load.script(
    'BlurY',
    'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurY.js'
  );

  game.load.image('sky', 'images/sky.png');
  game.load.image('cloud', 'images/cloud.png');
  game.load.image('star', 'images/star.png');
  game.load.image('dragon', 'images/dragon.png');
  game.load.image('pegasus', 'images/pegasus.png');
}

var player;
var cursors;

var clouds;
var x;

var stars;
var starCreateX;
var starResetX;

var score = 0;
var scoreText;

var dragon;
var dragonCreateX;

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.setBoundsToWorld();

  game.add.sprite(0, 0, 'sky');

  createText();

  // Add Clouds
  clouds = game.add.group();
  clouds.enableBody = true;
  var cloud = clouds.create(250, 150, 'cloud');
  cloud.checkWorldBounds = true;
  cloud.events.onOutOfBounds.add(cloudOut, this);
  cloud.body.velocity.y = 100;

  // Add Player
  player = game.add.sprite(350, game.world.height - 140, 'pegasus');
  game.physics.arcade.enable(player);
  player.body.gravity.y = 0;
  player.body.collideWorldBounds = true;

  // Add Stars
  stars = game.add.group();
  stars.enableBody = true;
  for (var i = 0; i < 10; i++) {
    createStar();
  }

  // Add Dragon
  dragonCreateX = Math.floor(Math.random() * Math.floor(670));
  dragon = game.add.sprite(dragonCreateX, 0, 'dragon');
  game.physics.arcade.enable(dragon);
  dragon.body.collideWorldBounds = true;
  dragon.body.gravity.x = game.rnd.integerInRange(-50, 50);
  dragon.body.gravity.y = 20 + Math.random() * 100;
  dragon.body.bounce.setTo(1);

  // Add a input listener that can help us return from being paused
  game.input.onDown.add(unpause, self);

  // Assign cursors to variable
  cursors = game.input.keyboard.createCursorKeys();
}

function update() {
  game.physics.arcade.overlap(player, stars, collectStar, null, this);

  game.physics.arcade.collide(player, dragon, gameOver, null, this);

  //  Reset the player's velocity (movement)
  player.body.velocity.x = 0;
  if (cursors.left.isDown) {
    //  Move to the left
    player.body.velocity.x = -250;
  } else if (cursors.right.isDown) {
    //  Move to the right
    player.body.velocity.x = 250;
  } else {
    //  Still
    player.animations.stop();
  }
}

function createText() {
  // Add Score Section
  scoreText = game.add.text(16, 16, 'score:');
  scoreText.font = 'VT323';
  scoreText.fontSize = 36;

  // Create a label to use as a pause button
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

function blur(action, sprite) {
  var blurX = game.add.filter('BlurX');
  var blurY = game.add.filter('BlurY');

  if (action === 'add') {
    blurX.blur = 10;
    blurY.blur = 1;
  } else {
    blurX.blur = 0;
    blurY.blur = 0;
  }

  for (i = 1; i < arguments.length; i++) {
    arguments[i].filters = [blurX, blurY];
  }
}

function unpause(event) {
  // Only act if paused
  if (game.paused) {
    // Unpause the game
    game.paused = false;
    blur('remove', dragon, player, clouds, stars);
  }
}

function cloudOut(cloud) {
  x = Math.floor(Math.random() * Math.floor(400));
  cloud.reset(x, -200);
  cloud.body.velocity.y = 100;
}

function createStar() {
  starCreateX = Math.floor(Math.random() * Math.floor(775));
  var star = stars.create(starCreateX, -25, 'star');
  star.checkWorldBounds = true;
  star.events.onOutOfBounds.add(starOut, this);
  star.body.velocity.y = 125;
}

function starOut(star) {
  starResetX = Math.floor(Math.random() * Math.floor(775));
  star.reset(starResetX, -25);
  star.body.velocity.y = 125;
}

function collectStar(player, star) {
  // Removes the star from the screen and creates a new one
  star.kill();
  createStar();

  //  Add and update the score
  score += 10;
  scoreText.text = `score: ${score}`;
}

function gameOver(player, dragon) {
  game.paused = true;
  player.tint = 0xff0000;
  blur('add', dragon, player, clouds, stars, scoreText, pauseLabel);

  // Create Game Over Message
  gameOverMsg = game.add.text(225, 180, `GAME OVER\n\nSCORE: ${score} `);
  gameOverMsg.font = 'VT323';
  gameOverMsg.fontSize = 100;
  gameOverMsg.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
}

// TODO: Find a way to randomize the dragons X and Y gravity
// numbers on world bounds collisions
