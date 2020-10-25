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

    layer.forEachTile((tile) => {
      switch (tile.index) {
        case 2:
          tile.setCollision(false, false, true, false, false);
          break;
        case 6:
          tile.setCollision(true);
          break;
      }
    });

    this.physics.world.setBounds(0, 0, widthInPixels, heightInPixels);
    this.physics.world.TILE_BIAS = 12;
    this.physics.add.collider(mario, layer);

    this.cameras.main.setBounds(0, 0, widthInPixels, heightInPixels);
    this.cameras.main.startFollow(mario, true);
  }
}
