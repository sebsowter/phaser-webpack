import GameInputs from "../inputs/GameInputs";
import Player from "../gameObjects/Player";
import Goomba from "../gameObjects/Goomba";

export class GameScene extends Phaser.Scene {
  private _collisionGroup: Phaser.GameObjects.Group;
  private _enemyGroup: Phaser.GameObjects.Group;
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
    this._enemyGroup = this.add.group();

    this._inputs = new GameInputs(this.input);

    this._player = new Player(this, 32, 192);

    const { widthInPixels, heightInPixels } = tilemap;

    this.physics.world.setBounds(0, -64, widthInPixels, heightInPixels + 64).TILE_BIAS = 8;

    this.physics.add.collider(this.collisionGroup, tileLayer);
    this.physics.add.overlap(this.player, this.enemyGroup, this.onCollideEnemy);

    this.cameras.main.setBounds(0, 0, widthInPixels, heightInPixels).startFollow(this.player, true);

    this.createObjects(tilemap);
  }

  private createObjects(tilemap: Phaser.Tilemaps.Tilemap) {
    const objectLayer = tilemap.getObjectLayer("objects");

    objectLayer?.objects.forEach((object) => {
      const { name, properties = [], x, y } = object;
      const map = new Map<string, boolean | number | string>();

      properties.forEach(({ name, value }) => map.set(name, value));

      switch (name) {
        case "goomba":
          return new Goomba(this, x, y, Boolean(map.get("flipX")));
      }
    });

    return this;
  }

  private onCollideEnemy(body1: Player, body2) {
    body1.wound();
  }

  public get collisionGroup() {
    return this._collisionGroup;
  }

  public get enemyGroup() {
    return this._enemyGroup;
  }

  public get inputs() {
    return this._inputs;
  }

  public get player() {
    return this._player;
  }
}
