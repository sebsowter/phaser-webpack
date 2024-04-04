import { GameScene } from "../scenes/GameScene";

export enum GoombaStates {
  STARTING,
  WALKING,
  FALLING,
  DYING,
}

export default class Goomba extends Phaser.Physics.Arcade.Sprite {
  public scene: GameScene;
  public body: Phaser.Physics.Arcade.Body;

  constructor(scene: GameScene, x: number, y: number, flipX?: boolean) {
    super(scene, x, y, "goomba");

    this.scene.physics.world.enable(this);
    this.scene.collisionGroup.add(this);
    this.scene.enemyGroup.add(this);

    this.scene.add
      .existing(this)
      .setOffset(0.5)
      .setData({ velocityX: 20 })
      .setFlipX(!!flipX)
      .setState(GoombaStates.STARTING);
  }

  public setState(value: GoombaStates) {
    switch (value) {
      case GoombaStates.STARTING:
      case GoombaStates.FALLING:
        this.play("goomba-default");
        break;

      case GoombaStates.WALKING:
        this.play("goomba-walk").setVelocityX(this.directionX * this.velocityX);
        break;

      case GoombaStates.DYING:
        this.play("goomba-death");
        break;
    }

    return super.setState(value);
  }

  public preUpdate(time: number, delta: number) {
    switch (this.state) {
      case GoombaStates.STARTING:
        this.setState(GoombaStates.WALKING);
        break;

      case GoombaStates.WALKING:
        if (!this.body.onFloor()) {
          this.setState(GoombaStates.FALLING);
        } else if (this.body.blocked.left || this.body.blocked.right) {
          this.setFlipX(!this.flipX).setVelocityX(this.directionX * this.velocityX);
        }
        break;

      case GoombaStates.FALLING:
        if (this.body.onFloor()) {
          this.setState(GoombaStates.WALKING);
        }
        break;
    }

    super.preUpdate(time, delta);
  }

  private get directionX() {
    return this.flipX ? -1 : 1;
  }

  private get velocityX() {
    return Number(this.getData("velocityX"));
  }
}
