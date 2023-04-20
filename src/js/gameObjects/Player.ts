import GameScene from "../scenes/GameScene";

export enum PlayerStates {
  STANDING,
  FALLING,
  CROUCHING,
  JUMPING,
  WALKING,
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
  public scene: GameScene;
  public body: Phaser.Physics.Arcade.Body;

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, "player");

    const animations: Phaser.Types.Animations.Animation[] = [
      { key: "stand", frames: this.scene.anims.generateFrameNumbers(this.texture.key, { frames: [0] }) },
      {
        key: "walk",
        frameRate: 12,
        frames: this.scene.anims.generateFrameNumbers(this.texture.key, { frames: [1, 2, 0] }),
        repeat: -1,
      },
      { key: "jump", frames: this.scene.anims.generateFrameNumbers(this.texture.key, { frames: [2] }) },
      { key: "crouch", frames: this.scene.anims.generateFrameNumbers(this.texture.key, { frames: [3] }) },
    ];
    animations.forEach((animation) => this.scene.anims.create(animation));

    this.scene.physics.world.enable(this);

    this.scene.collisionGroup.add(this);

    this.body.setAllowDrag(true).setMaxVelocityX(160);

    this.scene.add
      .existing(this)
      .setSize(24)
      .setCollideWorldBounds(true)
      .setDragX(Math.pow(16, 2))
      .setState(PlayerStates.STANDING);
  }

  public setState(value: PlayerStates) {
    switch (value) {
      case PlayerStates.CROUCHING:
        this.setSize(16).play("crouch");
        break;

      case PlayerStates.FALLING:
        this.setSize(24).play("jump");
        break;

      case PlayerStates.JUMPING:
        this.setSize(24).setVelocityY(-260).play("jump").playAudio("jump");
        break;

      case PlayerStates.STANDING:
        this.setSize(24)
          .setVelocityX(this.body.velocity.x * 0.5)
          .play("stand");
        break;

      case PlayerStates.WALKING:
        this.setSize(24).play("walk");
        break;
    }

    return super.setState(value);
  }

  public preUpdate(time: number, delta: number) {
    const { left, right, down, jump } = this.scene.inputs;
    const flipX = left && !right ? true : right ? false : this.flipX;
    const directionX = -Number(left) + Number(right);
    const accelerationX = directionX * Math.pow(16, 2);

    switch (this.state) {
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
        if (this.body.velocity.y > 0) {
          this.setState(PlayerStates.FALLING);
        } else if (!jump) {
          this.setVelocityY(this.body.velocity.y * 0.9);
        }

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

  public playAudio(key: string) {
    this.scene.sound.play(key, { volume: 0.5 });

    return this;
  }
}
