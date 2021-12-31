import Inputs from "./Inputs";
import Mario from "./Mario";

export default class GameScene extends Phaser.Scene {
  private _inputs: Inputs;

  constructor() {
    super({
      key: "game",
      active: false,
      visible: false,
    });
  }

  public create() {
    const tilemap = this.make.tilemap({
      key: "tilemap",
    });
    const tileset = tilemap.addTilesetImage("tiles");
    const layer = tilemap.createLayer(0, tileset, 0, 0);

    this._inputs = new Inputs(this);

    const mario = new Mario(this, 32, 192);
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

    this.physics.world.setBounds(0, -64, widthInPixels, heightInPixels + 64);
    this.physics.world.TILE_BIAS = 8;
    this.physics.add.collider(mario, layer);

    this.cameras.main.setBounds(0, 0, widthInPixels, heightInPixels);
    this.cameras.main.startFollow(mario, true);
  }

  public get inputs() {
    return this._inputs;
  }
}
