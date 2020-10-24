import MarioInputs from "./MarioInputs";

enum MarioStates {
  STANDING = 0,
  FALLING = 1,
  CROUCHING = 2,
  JUMPING = 3,
  WALKING = 4,
}

export default class MarioSprite extends Phaser.Physics.Arcade.Sprite {
  public body: Phaser.Physics.Arcade.Body;
  public inputs: MarioInputs;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.setData({ jumpVelocity: -260, walkVelocity: 128 });

    this.body.setSize(16, 24);
    this.body.setOffset(0, 8);
    this.body.setCollideWorldBounds(true);

    this.inputs = new MarioInputs(this.scene);

    this.scene.anims.create({
      key: "stand",
      frameRate: 0,
      frames: this.scene.anims.generateFrameNumbers("player", {
        start: 0,
      }),
      repeat: 0,
    });

    this.scene.anims.create({
      key: "walk",
      frameRate: 12,
      frames: this.scene.anims.generateFrameNumbers("player", {
        start: 0,
        end: 2,
      }),
      repeat: -1,
    });

    this.scene.anims.create({
      key: "jump",
      frameRate: 0,
      frames: this.scene.anims.generateFrameNumbers("player", {
        start: 2,
      }),
    });

    this.scene.anims.create({
      key: "crouch",
      frameRate: 0,
      frames: this.scene.anims.generateFrameNumbers("player", {
        start: 3,
      }),
    });
  }

  public setState(value: number): this {
    switch (value) {
      case MarioStates.JUMPING:
        this.play("jump");
        this.body.velocity.y = this.getData("jumpVelocity");
        break;
      case MarioStates.WALKING:
        this.play("walk");
        break;
      case MarioStates.CROUCHING:
        this.play("crouch");
        this.body.setVelocity(0, 0);
        break;
      case MarioStates.FALLING:
        this.play("jump");
        break;
      case MarioStates.STANDING:
        this.play("stand");
        this.body.setVelocity(0, 0);
        break;
    }

    return super.setState(value);
  }

  public preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    const { left, right, down, jump } = this.inputs;
    const velocityX =
      (right ? 1 : left ? -1 : 0) * this.getData("walkVelocity");

    this.setFlipX(left ? true : right ? false : this.flipX);

    switch (this.state) {
      case MarioStates.STANDING:
        if (this.body.onFloor() && jump) {
          this.setState(MarioStates.JUMPING);
        } else if (this.body.onFloor() && (left || right)) {
          this.setState(MarioStates.WALKING);
        } else if (this.body.onFloor() && down) {
          this.setState(MarioStates.CROUCHING);
        } else if (!this.body.onFloor()) {
          this.setState(MarioStates.FALLING);
        }
        break;

      case MarioStates.WALKING:
        this.body.setVelocity(velocityX, 0);

        if (this.body.onFloor() && jump) {
          this.setState(MarioStates.JUMPING);
        } else if (!this.body.onFloor()) {
          this.setState(MarioStates.FALLING);
        } else if (!(this.body.onFloor() && (left || right))) {
          this.setState(MarioStates.STANDING);
        }
        break;

      case MarioStates.CROUCHING:
        if (!(this.body.onFloor() && down)) {
          this.setState(MarioStates.STANDING);
        }
        break;

      case MarioStates.JUMPING:
        if (this.body.velocity.y > 0) {
          this.setState(MarioStates.FALLING);
        }

      case MarioStates.FALLING:
        this.body.setVelocityX(velocityX);

        if (this.body.onFloor()) {
          this.setState(MarioStates.STANDING);
        }
        break;
    }
  }
}
