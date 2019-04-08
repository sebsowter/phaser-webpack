import Phaser from 'phaser';
import MarioScene from './MarioScene';

const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 224,
  zoom: 2,
  pixelArt: true,
  input: {
    queue: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {
        y: 500
      }
    }
  },
  scene: MarioScene
};

const game = new Phaser.Game(config);
