import Phaser from 'phaser';
import MarioInputs from './MarioInputs';
import { MarioState } from './MarioStates';

/**
 * MarioSprite
 */
export default class MarioSprite extends Phaser.GameObjects.Sprite {
  constructor(...config) {
    super(...config);
    
    this.setData('speed', 96);

    this.inputs = new MarioInputs(this.scene);
    
    this.scene.anims.create({
      key: "stand",
      frames: this.scene.anims.generateFrameNumbers("player", {
        start: 0,
        end: 0
      }),
      frameRate: 0,
      repeat: -1
    });

    this.scene.anims.create({
      key: "walk",
      frames: this.scene.anims.generateFrameNumbers("player", {
        start: 0,
        end: 2
      }),
      frameRate: 12,
      repeat: -1
    });

    this.scene.anims.create({
      key: "jump",
      frames: this.scene.anims.generateFrameNumbers("player", {
        start: 2,
        end: 2
      }),
      frameRate: 0,
      repeat: -1
    });

    this.scene.anims.create({
      key: "fall",
      frames: this.scene.anims.generateFrameNumbers("player", {
        start: 2,
        end: 2
      }),
      frameRate: 0,
      repeat: -1
    });

    this.scene.anims.create({
      key: "crouch",
      frames: this.scene.anims.generateFrameNumbers("player", {
        start: 3,
        end: 3
      }),
      frameRate: 0,
      repeat: -1
    });
  }

  checkState(state) {
    switch (state) {
      case MarioState.WALKING:
        return this.body.onFloor() && (this.inputs.isLeft || this.inputs.isRight);
      case MarioState.JUMPING:
        return this.body.onFloor() && this.inputs.isJump;
      case MarioState.CROUCHING:
        return !this.body.onFloor() && this.inputs.isDown;
      case MarioState.FALLING:
        return !this.body.onFloor();
      default:
        return;
    }
  }

  switchState(state) {
    switch (state) {
      case MarioState.JUMPING:
        this.setState(MarioState.JUMPING);
        this.play('jump');
        this.body.velocity.y = -224;
        this.jumpTimer = this.scene.time.delayedCall(500, () => {
          this.switchState(MarioState.FALLING);
        });
        break;
      case MarioState.WALKING:
        this.setState(MarioState.WALKING);
        this.play('walk');
        break;
      case MarioState.CROUCHING:
        this.setState(MarioState.CROUCHING);
        this.play('crouch');
        break;
      case MarioState.FALLING:
        this.setState(MarioState.FALLING);
        this.play('fall');
        break;
      default:
        this.setState(MarioState.STANDING);
        this.play('stand');
        break;
    }
  }

  updateState() {
    switch (this.state) {
      case MarioState.STANDING:
        if (this.checkState(MarioState.JUMPING)) {
          this.switchState(MarioState.JUMPING);
        } else if (this.checkState(MarioState.WALKING)) {
          this.switchState(MarioState.WALKING);
        } else if (this.checkState(MarioState.CROUCHING)) {
          this.switchState(MarioState.CROUCHING);
        } else if (this.checkState(MarioState.FALLING)) {
          this.switchState(MarioState.FALLING);
        }
        break;
      case MarioState.WALKING:
        if (this.checkState(MarioState.JUMPING)) {
          this.switchState(MarioState.JUMPING);
        } else if (this.checkState(MarioState.FALLING)) {
          this.switchState(MarioState.FALLING);
        } else if (!this.checkState(MarioState.WALKING)) {
          this.switchState(MarioState.STANDING);
        }
        break;
      case MarioState.CROUCHING:
      if (this.checkState(MarioState.JUMPING)) {
          this.switchState(MarioState.JUMPING);
        } else if (this.checkState(MarioState.FALLING)) {
          this.switchState(MarioState.FALLING);
        } else if (!this.checkState(MarioState.CROUCHING)) {
          this.switchState(MarioState.STANDING);
        }
        break;
      case MarioState.FALLING:
      case MarioState.JUMPING:
        if (this.body.onFloor()) {
          this.switchState(MarioState.STANDING);
        }
        break;
      default:
        break;
    }
  }

  updateVelocity() {

    var direction = new Phaser.Geom.Point(
      this.inputs.isLeft ? -1 : this.inputs.isRight ? 1 : 0,
      this.inputs.isUp ? -1 : this.inputs.isDown ? 1 : 0
    );

    switch (this.state) {
      case MarioState.WALKING:
        console.log('direction', direction.x );
        this.body.velocity.y = 0;
      case MarioState.FALLING:
      case MarioState.JUMPING:
        this.body.velocity.x = direction.x * this.getData('speed');
        break;
      case MarioState.STANDING:
      case MarioState.CROUCHING:
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        break;
      default:
        break;
    }
  }

  update() {
    this.updateState();

    var direction = new Phaser.Geom.Point(
      this.inputs.isLeft ? -1 : this.inputs.isRight ? 1 : 0,
      this.inputs.isUp ? -1 : this.inputs.isDown ? 1 : 0
    );

    // Set direction
    //this.scale.x = this.facing = direction.x === 0 ? this.facing : direction.x;


    this.flipX = direction.x < 0;
    this.updateVelocity();
  }
}
