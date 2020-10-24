import MarioSprite from "./MarioSprite";

export default class MarioScene extends Phaser.Scene {
  constructor() {
    super({
      key: "game",
      active: false,
      visible: false,
    });
  }

  public create(): void {
    // Create tilemap
    const tilemap = this.make.tilemap({
      key: "tilemap",
    });

    const tileset = tilemap.addTilesetImage("tiles");

    const layer = tilemap.createDynamicLayer(0, tileset, 0, 0);
    layer.setCollision(6);

    layer.forEachTile((tile) => {
      switch (tile.index) {
        case 2:
          tile.setCollision(false, false, true, false, false);
          break;
      }
    });

    // Create Mario
    const mario = new MarioSprite(this, 32, 192, "player");

    // Set world bounds
    this.physics.world.setBounds(
      0,
      0,
      tilemap.widthInPixels,
      tilemap.heightInPixels
    );

    this.physics.world.TILE_BIAS = 12;

    // Add collider between Mario and tilemap layer
    this.physics.add.collider(mario, layer);

    // Set camera bounds
    this.cameras.main.setBounds(
      0,
      0,
      tilemap.widthInPixels,
      tilemap.heightInPixels
    );
    this.cameras.main.startFollow(mario, true);
  }
}
