export default class LoaderScene extends Phaser.Scene {
  public preload(): void {
    this.load.tilemapTiledJSON("tilemap", "./assets/tilemaps/tilemap.json");
    this.load.image("tiles", "./assets/images/tiles.png");
    this.load.spritesheet("player", "./assets/images/player.png", {
      frameWidth: 16,
      frameHeight: 32,
    });
  }

  public create(): void {
    this.scene.start("game");
  }
}
