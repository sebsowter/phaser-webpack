export default class LoaderScene extends Phaser.Scene {
  public preload() {
    this.load.image("tiles", "./assets/images/tiles.png");
    this.load.audio("jump", "./assets/audio/jump.mp3");
    this.load.spritesheet("player", "./assets/images/player.png", { frameWidth: 16, frameHeight: 32 });
    this.load.tilemapTiledJSON("tilemap", "./assets/tilemaps/tilemap.json");
  }

  public create() {
    this.scene.start("game");
  }
}
