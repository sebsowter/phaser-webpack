import Phaser from 'phaser';
import MarioSprite from './MarioSprite';

/**
 * @classdesc
 * Represents a Mario Scene.
 * 
 * @class MarioScene
 * @extends Phaser.Scene
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
    this.load.image('tiles', './assets/images/tiles.png');

    // Load player spritesheet
    this.load.spritesheet('player', './assets/images/player.png', {
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
    layer.setCollision(6);

    // Create Mario
    this.mario = new MarioSprite(this, 32, 192, 'player');

    // Add collider between Mario and tilemap layer
    this.physics.add.collider(this.mario, layer);

    // Set camera bounds
    const camera = this.cameras.main;
    camera.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels);

    // Tell camera to follow Mario
    camera.startFollow(this.mario, true);
  }
}
