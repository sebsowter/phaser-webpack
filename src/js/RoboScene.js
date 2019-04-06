import Player from './Player';
import Enemy from './Enemy';

const ASSET_PATH = './assets/images/'

const assets = {
  tilemap: `./assets/tilemaps/tilemap.json`,
  tiles: `${ASSET_PATH}tiles.gif`,
  background: `${ASSET_PATH}background.gif`,
  ui: `${ASSET_PATH}ui.gif`,
  player: `${ASSET_PATH}player.gif`,
  enemy: `${ASSET_PATH}enemy.gif`,
  projectile: `${ASSET_PATH}projectile.gif`,
  projectile2: `${ASSET_PATH}projectile2.gif`,
  crosshair: `${ASSET_PATH}crosshair.gif`
};

export default class RoboScene extends Phaser.Scene {
  constructor(config) {
    super(config);
  }
  
  init() {
    console.log('onInit');
  }
  
  preload() {
    console.log('onPreload');
    this.load.tilemapTiledJSON("World", assets.tilemap);
    this.load.image('tiles', assets.tiles);
    this.load.image('background', assets.background);
    this.load.image('ui', assets.ui);
    this.load.image('crosshair', assets.crosshair);
    this.load.spritesheet('player', assets.player, {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('enemy', assets.enemy, {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('projectile', assets.projectile, {
      frameWidth: 8,
      frameHeight: 8
    });
    this.load.spritesheet('projectile2', assets.projectile2, {
      frameWidth: 8,
      frameHeight: 8
    });
  }
  
  create() {
    console.log('onCreate');
    
    const map = this.make.tilemap({ key: 'World' });
    const tileset = map.addTilesetImage('tiles');

    this.mapLayer = map.createDynamicLayer(0, tileset, 0, 0);
    this.mapLayer.setCollisionBetween(3, 64);
    
    this.player = new Player(this, 32, 32, this.mapLayer, this.enemiesGroup);
    
    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.startFollow(this.player.sprite);
  }
  
  update() {
    this.player.update();
  }
}
