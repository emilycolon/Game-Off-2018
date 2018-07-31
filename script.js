var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container', {
  preload: preload,
  create: create,
  update: update
});

function preload() {
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

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.setBoundsToWorld();

  game.add.sprite(0, 0, 'sky');

  // Add Clouds
  clouds = game.add.group();
  clouds.enableBody = true;
  var cloud = clouds.create(250, 150, 'cloud');
  cloud.checkWorldBounds = true;
  cloud.events.onOutOfBounds.add(cloudOut, this);
  cloud.body.velocity.y = 100;

  // Add Player
  player = game.add.sprite(350, game.world.height - 120, 'pegasus');
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

  scoreText = game.add.text(16, 16, 'score: 0', {
    fontSize: '32px',
    fill: '#000'
  });

  cursors = game.input.keyboard.createCursorKeys();
}

function update() {
  // if (gameOver) {
  //   return;
  // }

  game.physics.arcade.overlap(player, stars, collectStar, null, this);

  //  Reset the players velocity (movement)
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
  scoreText.text = 'Score: ' + score;
}

function gotCaught(player, dragon) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play('turn');

  gameOver = true;
}
