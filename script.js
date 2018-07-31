const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

function preload() {
  this.load.image('sky', 'images/sky.png');
  this.load.image('star', 'images/star.png');
  this.load.image('dragon', 'images/dragon.png');
  this.load.image('dude', 'images/pegasus.png');
}

var player;
var cursors;
var stars;
var score = 0;
var scoreText;
var dragons;

function create() {
  this.add.image(400, 300, 'sky');

  player = this.physics.add.sprite(100, 300, 'dude');
  player.setCollideWorldBounds(true);

  cursors = this.input.keyboard.createCursorKeys();

  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  stars.children.iterate(child => {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  this.physics.add.overlap(player, stars, collectStar, null, this);

  scoreText = this.add.text(16, 16, 'score: 0', {
    fontSize: '32px',
    fill: '#000'
  });

  dragons = this.physics.add.group();

  this.physics.add.collider(player, bombs, hitDragon, null, this);
}

function collectStar(player, star) {
  star.disableBody(true, true);

  score += 10;
  scoreText.setText('score: ' + score);

  if (stars.countActive(true) === 0) {
    stars.children.iterate(child => {
      child.enableBody(true, child.x, 0, true, true);
    });

    var x =
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
  }
}

function hitDragon(player, bomb) {
  this.physics.pause();
  player.setTint(0xff0000);
  gameOver = true;
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    // player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    // player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
  }

  // if (cursors.up.isDown && player.body.touching.down) {
  //   player.setVelocityY(-400);
  // }
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM up and running....');
});
