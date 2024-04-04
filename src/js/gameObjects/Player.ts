import { GameScene } from "../scenes/GameScene";

export enum PlayerStates {
  STARTING,
  STANDING,
  FALLING,
  CROUCHING,
  JUMPING,
  WALKING,
  DYING,
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
  public scene: GameScene;
  public body: Phaser.Physics.Arcade.Body;

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, "player");

    this.scene.physics.world.enable(this);
    this.scene.collisionGroup.add(this);

    this.body.setAllowDrag(true).setMaxVelocityX(160);

    this.scene.add.existing(this).setCollideWorldBounds(true).setDragX(this.drag).setState(PlayerStates.STARTING);
  }

  public setState(value: PlayerStates) {
    switch (value) {
      case PlayerStates.STARTING:
        this.setSize(24).play("player-idol");
        break;

      case PlayerStates.CROUCHING:
        this.setSize(16).play("player-crouch");
        break;

      case PlayerStates.FALLING:
        this.setSize(24).play("player-jump");
        break;

      case PlayerStates.JUMPING:
        this.setSize(24).setVelocityY(-260).play("player-jump").playAudio("jump");
        break;

      case PlayerStates.STANDING:
        this.setSize(24)
          .setVelocityX(this.body.velocity.x * 0.5)
          .play("player-idol");
        break;

      case PlayerStates.WALKING:
        this.setSize(24).play("player-walk");
        break;

      case PlayerStates.DYING:
        this.setSize(24);
        break;
    }

    return super.setState(value);
  }

  public preUpdate(time: number, delta: number) {
    const { left, right, down, jump } = this.scene.inputs;

    //this.scene.input.keyboard.addCapture()

    const flipX = left && !right ? true : right ? false : this.flipX;
    const accelerationX = (-Number(left) + Number(right)) * this.accelerationX;

    switch (this.state) {
      case PlayerStates.STARTING:
        this.setState(PlayerStates.STANDING);
        break;

      case PlayerStates.STANDING:
        if (!this.body.onFloor()) {
          this.setState(PlayerStates.FALLING);
        } else if (jump) {
          this.setState(PlayerStates.JUMPING);
        } else if (left || right) {
          this.setState(PlayerStates.WALKING);
        } else if (down) {
          this.setState(PlayerStates.CROUCHING);
        }
        break;

      case PlayerStates.WALKING:
        this.setFlipX(flipX).setAccelerationX(accelerationX);

        if (!this.body.onFloor()) {
          this.setState(PlayerStates.FALLING);
        } else if (jump) {
          this.setState(PlayerStates.JUMPING);
        } else if (!left && !right) {
          if (down) {
            this.setState(PlayerStates.CROUCHING);
          } else {
            this.setState(PlayerStates.STANDING);
          }
        }
        break;

      case PlayerStates.CROUCHING:
        if (!this.body.onFloor()) {
          this.setState(PlayerStates.FALLING);
        } else if (jump) {
          this.setState(PlayerStates.JUMPING);
        } else if (!down) {
          this.setState(PlayerStates.STANDING);
        }
        break;

      case PlayerStates.JUMPING:
        this.setFlipX(flipX).setAccelerationX(accelerationX);

        if (this.body.velocity.y > 0) {
          this.setState(PlayerStates.FALLING);
        } else if (this.body.onFloor()) {
          if (left || right) {
            this.setState(PlayerStates.WALKING);
          } else {
            this.setState(PlayerStates.STANDING);
          }
        } else if (!jump) {
          this.setVelocityY(this.body.velocity.y * 0.9);
        }
        break;

      case PlayerStates.FALLING:
        this.setFlipX(flipX).setAccelerationX(accelerationX);

        if (this.body.onFloor()) {
          if (left || right) {
            this.setState(PlayerStates.WALKING);
          } else {
            this.setState(PlayerStates.STANDING);
          }
        }
        break;
    }

    super.preUpdate(time, delta);
  }

  public setSize(height: number) {
    super.setSize(16, height);

    this.body.setOffset(0, this.height - height);

    return this;
  }

  public wound() {
    if (this.state !== PlayerStates.DYING) {
      // return this.setState(PlayerStates.DYING);
    }

    return this;
  }

  private playAudio(key: string) {
    this.scene.sound.play(key, { volume: 0.5 });

    return this;
  }

  private get accelerationX() {
    return Math.pow(16, 2);
  }

  private get drag() {
    return Math.pow(16, 2);
  }
}
