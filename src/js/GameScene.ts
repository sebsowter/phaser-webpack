import MarioSprite from "./MarioSprite";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: "game",
      active: false,
      visible: false,
    });
  }

  public create(): void {
    const tilemap = this.make.tilemap({
      key: "tilemap",
    });
    const tileset = tilemap.addTilesetImage("tiles");
    const layer = tilemap.createDynamicLayer(0, tileset, 0, 0);
    const mario = new MarioSprite(this, 32, 192);
    const { widthInPixels, heightInPixels } = tilemap;

    layer.forEachTile(function (tile: Phaser.Tilemaps.Tile) {
      switch (tile.index) {
        case 2:
        case 6:
          tile.setCollision(true);
          break;
        case 9:
        case 10:
          tile.setCollision(false, false, true, false, false);
          break;
      }
    }, this);

    this.physics.world.setBounds(0, 0, widthInPixels, heightInPixels);
    this.physics.world.TILE_BIAS = 8;
    this.physics.add.collider(mario, layer);

    this.cameras.main.setBounds(0, 0, widthInPixels, heightInPixels);
    this.cameras.main.startFollow(mario, true);
  }
}
