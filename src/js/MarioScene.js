import Phaser from 'phaser';
import MarioSprite from './MarioSprite';

/**
 * @classdesc
 * Represents a Mario Scene.
 * 
 * @class MarioScene
 * @extends Phaser.Scene
 * @memberof Phaser
 * @constructor
 * 
 * @param {(string|Phaser.Scenes.Settings.Config)} config - Scene specific configuration settings.
 */
export default class MarioScene extends Phaser.Scene {

  /**
   * Preload scene assets.
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
   * Create scene.
   */
  create() {

    // Create tilemap
    const tilemap = this.make.tilemap({
        key: 'World1'
    });

    // Set world bounds
    this.physics.world.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels);

    // Create tileset
    const tileset = tilemap.addTilesetImage('tiles');
    
    // Create dynamic layer and set collisions
    const layer = tilemap.createDynamicLayer(0, tileset, 0, 0);
    layer.setCollision(2);
    layer.setCollision(8);

    // Create Mario sprite and add collider for collisions with dynamic layer
    this.mario = new MarioSprite(this, 2 * 16, 11 * 16, 'player');
    this.physics.add.collider(this.mario, layer);

    // Set camera bounds and follow Mario
    const camera = this.cameras.main;
    camera.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels);
    camera.startFollow(this.mario);
  }
}
