import Intro from './Intro.js';
import Screen1 from './Screen1.js';
import Screen2 from './Screen2.js';
import Game from './Game.js';

let config = {
    type: Phaser.CANVAS,
    width: 500,
    height: 800,
    transparent: true,    
};

const game = new Phaser.Game(config);
game.scene.add('Intro', Intro);
game.scene.add('Game', Game);
game.scene.start('Intro');

