import Phaser from 'phaser';
import MarioSprite from './MarioSprite';

/**
 * MarioScene
 */
export default class MarioScene extends Phaser.Scene {

  /**
   * preload
   */
  preload() {

    // Load tilemap
    this.load.tilemapTiledJSON('World1', './assets/tilemaps/tilemap.json');

    // Load tiles image
    this.load.image('tiles', './assets/images/tiles.gif');

    // Load player spritesheet
    this.load.spritesheet('player', './assets/images/player.gif', {
      frameWidth: 16,
      frameHeight: 32
    });
  }
  
  /**
   * create
   */
  create() {
    const map = this.make.tilemap({
        key: 'World1'
    });
    const tileset = map.addTilesetImage('tiles');
    const layer = map.createDynamicLayer(0, tileset, 0, 0);
    layer.setCollision(2);
    layer.setCollision(8);

    this.mario = new MarioSprite(this, 2 * 16, 11 * 16, 'player', 0);
    this.physics.add.collider(this.mario, layer);

    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.startFollow(this.mario);
  }

  /**
   * update
   */
  update() {
    console.log('u');
    this.mario.update();
  }
}
