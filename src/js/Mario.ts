import GameScene from "./GameScene";

export enum MarioStates {
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
    super(scene, x, y, "player");

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
        frames: this.scene.anims.generateFrameNumbers(this.texture.key, { frames }),
      });
    });

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.body.setAllowDrag(true).setMaxVelocityX(160);

    this.setSize(24).setCollideWorldBounds(true).setDragX(Math.pow(16, 2)).setState(MarioStates.STANDING);
  }

  public setState(value: MarioStates) {
    switch (value) {
      case MarioStates.CROUCHING:
        this.setSize(16).play("crouch");
        break;

      case MarioStates.FALLING:
        this.setSize(24).play("jump");
        break;

      case MarioStates.JUMPING:
        this.setSize(24).setVelocityY(-260).play("jump").playAudio("jump");
        break;

      case MarioStates.STANDING:
        this.setSize(24)
          .setVelocityX(this.body.velocity.x * 0.5)
          .play("stand");
        break;

      case MarioStates.WALKING:
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
      case MarioStates.STANDING:
        if (!this.body.onFloor()) {
          this.setState(MarioStates.FALLING);
        } else if (jump) {
          this.setState(MarioStates.JUMPING);
        } else if (left || right) {
          this.setState(MarioStates.WALKING);
        } else if (down) {
          this.setState(MarioStates.CROUCHING);
        }
        break;

      case MarioStates.WALKING:
        this.setFlipX(flipX).setAccelerationX(accelerationX);

        if (!this.body.onFloor()) {
          this.setState(MarioStates.FALLING);
        } else if (jump) {
          this.setState(MarioStates.JUMPING);
        } else if (!left && !right) {
          if (down) {
            this.setState(MarioStates.CROUCHING);
          } else {
            this.setState(MarioStates.STANDING);
          }
        }
        break;

      case MarioStates.CROUCHING:
        if (!this.body.onFloor()) {
          this.setState(MarioStates.FALLING);
        } else if (jump) {
          this.setState(MarioStates.JUMPING);
        } else if (!down) {
          this.setState(MarioStates.STANDING);
        }
        break;

      case MarioStates.JUMPING:
        if (this.body.velocity.y > 0) {
          this.setState(MarioStates.FALLING);
        } else if (!jump) {
          this.setVelocityY(this.body.velocity.y * 0.9);
        }

      case MarioStates.FALLING:
        this.setFlipX(flipX).setAccelerationX(accelerationX);

        if (this.body.onFloor()) {
          if (left || right) {
            this.setState(MarioStates.WALKING);
          } else {
            this.setState(MarioStates.STANDING);
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
