# Project 4 - Capstone

### _Rainbow Unicorn Dash!_ is a retro-inspired, browser based game, created as my capstone project for General Assembly's WDI training.

![alt text](https://pages.git.generalassemb.ly/emilycolon/project-4/planning/finished.png 'Rainbow Unicorn Dash!')

## Features

Play as a rainbow unicorn and collect as many rainbow stars as you can. Avoid the dragon! See how high you can get your score before the dragon catches you!

While developing this game, the following features were considered for the various stages of the project:

| Feature                                     | MVP | Silver | Gold |
| ------------------------------------------- | --- | ------ | ---- |
| Top-Down Scroll                             | X   | X      | X    |
| Player Sprite                               | X   | X      | X    |
| Collectable Sprite                          | X   | X      | X    |
| "Enemy" Sprite                              | X   | X      | X    |
| Game Over Indicator                         | X   | X      | X    |
| Sound Effects/Audio                         |     | X      | X    |
| Increase Collectable Speed w/ Game Progress |     | X      | X    |
| Upgrade Sprite Animations                   |     |        | X    |
| Full Responsiveness (Mobile-Friendly)       |     |        | X    |

The current game encompasses all MVP and Silver level features. Gold-level features will be included in the near future.

## Technologies Used

_Rainbow Unicorn Dash!_ was created using JavaScript and [Phaser](https://phaser.io) 2.6.2, which is and open source HTML5 game framework. The JavaScript game itself appears on a page coded in HTML5 and CSS3.

## Getting Started

In order to include Phaser 2.6.2, you will need to either install via [npm](https://www.npmjs.com) or include a CDN. The code included in this repo utilizes the [Phaser CDN from jsDelivr](https://www.jsdelivr.com/projects/phaser) by including this in the HTML:

```html
<script src="https://cdn.jsdelivr.net/phaser/2.6.2/phaser.min.js"></script>
```

Feel free to fork and clone this repo to either play the game locally or expand on the code. You will also need to set up a local web server in order to develop the game. Phaser offers a great, [step-by-step guide](http://phaser.io/tutorials/getting-started-phaser2/part2) on how to do that. While developing, I utlized [http-server](https://www.npmjs.com/package/http-server) for [node.js](https://nodejs.org/en/).

## Help the Game Improve!

If you would like submit suggestions for improvement, please submit an issue on this repo by clicking [here](https://git.generalassemb.ly/emilycolon/project-4/issues).
