import GameInputs from "../input/GameInputs";
import Player from "../gameObjects/Player";

export default class GameScene extends Phaser.Scene {
  private _collisionGroup: Phaser.GameObjects.Group;
  private _inputs: GameInputs;
  private _player: Player;

  constructor() {
    super({ key: "game", active: false, visible: false });
  }

  public preload() {
    this.load.tilemapTiledJSON("tilemap", "./assets/tilemaps/tilemap.json");
  }

  public create() {
    const tilemap = this.make.tilemap({ key: "tilemap" });
    const tileset = tilemap.addTilesetImage("tiles");

    const tileLayer = tilemap.createLayer(0, tileset, 0, 0).forEachTile((tile) => {
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
    });

    this._collisionGroup = this.add.group();

    this._inputs = new GameInputs(this.input);

    this._player = new Player(this, 32, 192);

    const { widthInPixels, heightInPixels } = tilemap;

    this.physics.world.setBounds(0, -64, widthInPixels, heightInPixels + 64).TILE_BIAS = 8;

    this.physics.add.collider(this.collisionGroup, tileLayer);

    this.cameras.main.setBounds(0, 0, widthInPixels, heightInPixels).startFollow(this.player, true);
  }

  public get collisionGroup() {
    return this._collisionGroup;
  }

  public get inputs() {
    return this._inputs;
  }

  public get player() {
    return this._player;
  }
}
