/*
 * Script for index.html
 * required by script.js
 */

// This function applies blur to specific elements sent as arguments
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

// This function unpauses the game
function unpause() {
  if (game.paused) {
    // Unpause the game
    game.paused = false;
    blur('remove', dragon, player, clouds, stars);
  }
}

/* 
 * cloudOut and starOut functions based on Out of Bounds code example
 * found here: https://phaser.io/examples/v2/sprites/out-of-bounds
 * 
 */
// This function resets the cloud's horizontal location when it goes outside the world
// bounds and has it appear back at the top of the screen
function cloudOut(cloud) {
  cloud.reset(Math.floor(Math.random() * Math.floor(400)), -200);
  cloud.body.velocity.y = 100;
}

// This function creates the star elements
// (this was done so create could be called again when a star has been collected)
function createStar() {
  var star = stars.create(
    Math.floor(Math.random() * Math.floor(775)),
    -25,
    'star'
  );
  star.checkWorldBounds = true;
  star.events.onOutOfBounds.add(starOut, this);
  assignVelocity(star);
}

// This function resets the star's horizontal location when it goes outside the world
// bounds and has it appear back at the top of the screen
function starOut(star) {
  star.reset(Math.floor(Math.random() * Math.floor(775)), -25);
  assignVelocity(star);
}

// This function assigns a velocity to the star the is based on the current score
// (increases the challenge)
function assignVelocity(star) {
  if (score < 300) {
    return (star.body.velocity.y = 125);
  } else if (score < 600) {
    return (star.body.velocity.y = 175);
  } else if (score < 900) {
    return (star.body.velocity.y = 225);
  } else if (score < 1500) {
    return (star.body.velocity.y = 275);
  } else {
    return (star.body.velocity.y = 325);
  }
}

// This function is called when a star has been "collected"
// Removed the element collected and creates a new one
function collectStar(player, star) {
  ping.play();
  // Removes the star from the screen and creates a new one
  star.kill();
  createStar();

  //  Add and update the score
  score += 10;
  scoreText.text = `score: ${score}`;
}

// Ends the game and shows game over message
function endPause() {
  blur('add', dragon, player, clouds, stars, scoreText, pauseLabel);

  // Create Game Over Message
  gameOverMsg = game.add.text(225, 180, `GAME OVER\nSCORE: ${score} `);
  gameOverMsg.font = 'VT323';
  gameOverMsg.fontSize = 100;
  gameOverMsg.setShadow(4, 4, 'rgba(0,0,0,0.5)', 5);
  game.paused = true;
}

// This function is called when the player and dragon overlap
// Stops player and dragon movement, plays sound effect
function gameOver() {
  player.body.velocity.x = 0;
  if (cursors.left.isDown) {
    //  Do not allow move to the left
    player.body.velocity.x = 0;
  } else if (cursors.right.isDown) {
    //  Do not allow move to the right
    player.body.velocity.x = 0;
  }
  dead.play();
  player.tint = 0xff0000;
  dragon.body.velocity = (0, 0);
  game.time.events.add(Phaser.Timer.SECOND * 1, endPause, this);
}
