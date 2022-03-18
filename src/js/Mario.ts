import GameScene from "./GameScene";

enum States {
  STANDING,
  FALLING,
  CROUCHING,
  JUMPING,
  WALKING,
}

export default class Mario extends Phaser.Physics.Arcade.Sprite {
  public scene: GameScene;
  public body: Phaser.Physics.Arcade.Body;

  constructor(scene: GameScene, x: number, y: number) {
    const texture = "player";

    super(scene, x, y, texture);

    Object.entries({
      stand: { frames: [0] },
      walk: { frameRate: 12, frames: [1, 2, 0], repeat: -1 },
      jump: { frames: [2] },
      crouch: { frames: [3] },
    }).forEach(([key, data]) => {
      const { frameRate, frames, repeat } = data;

      this.scene.anims.create({
        key,
        frameRate,
        repeat,
        frames: this.scene.anims.generateFrameNumbers(texture, { frames }),
      });
    });

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.body.setAllowDrag(true).setMaxVelocityX(160);

    this.setSize(24)
      .setCollideWorldBounds(true)
      .setDragX(Math.pow(16, 2))
      .setState(States.STANDING);
  }

  public setState(value: States) {
    switch (value) {
      case States.STANDING:
        this.setSize(24)
          .setVelocityX(this.body.velocity.x * 0.5)
          .play("stand");
        break;

      case States.WALKING:
        this.setSize(24).play("walk");
        break;

      case States.CROUCHING:
        this.setSize(16).play("crouch");
        break;

      case States.JUMPING:
        this.setSize(24).setVelocityY(-260).play("jump").playAudio("jump");
        break;

      case States.FALLING:
        this.setSize(24).play("jump");
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
      case States.STANDING:
        if (!this.body.onFloor()) {
          this.setState(States.FALLING);
        } else if (jump) {
          this.setState(States.JUMPING);
        } else if (left || right) {
          this.setState(States.WALKING);
        } else if (down) {
          this.setState(States.CROUCHING);
        }
        break;

      case States.WALKING:
        this.setFlipX(flipX).setAccelerationX(accelerationX);

        if (!this.body.onFloor()) {
          this.setState(States.FALLING);
        } else if (jump) {
          this.setState(States.JUMPING);
        } else if (!left && !right) {
          if (down) {
            this.setState(States.CROUCHING);
          } else {
            this.setState(States.STANDING);
          }
        }
        break;

      case States.CROUCHING:
        if (!this.body.onFloor()) {
          this.setState(States.FALLING);
        } else if (jump) {
          this.setState(States.JUMPING);
        } else if (!down) {
          this.setState(States.STANDING);
        }
        break;

      case States.JUMPING:
        if (this.body.velocity.y > 0) {
          this.setState(States.FALLING);
        } else if (!jump) {
          this.setVelocityY(this.body.velocity.y * 0.9);
        }

      case States.FALLING:
        this.setFlipX(flipX).setAccelerationX(accelerationX);

        if (this.body.onFloor()) {
          if (left || right) {
            this.setState(States.WALKING);
          } else {
            this.setState(States.STANDING);
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
