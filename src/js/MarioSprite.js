import Phaser from 'phaser';
import MarioInputs from './MarioInputs';
import MarioStates from './MarioStates';

/**
 * MarioSprite
 */
export default class MarioSprite extends Phaser.GameObjects.Sprite {
  constructor(...config) {
    super(...config);

    this.inputs = new MarioInputs(this.scene);
    
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.setSize(16, 24);
    this.body.setOffset(0, 8);
    
    this.setData('facingRight', true);
    this.setData('jumpVelocity', -192);
    this.setData('walkVelocity', 128);
    
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
      case MarioStates.WALKING:
        return this.body.onFloor() && (this.inputs.isLeft || this.inputs.isRight);
      case MarioStates.JUMPING:
        return this.body.onFloor() && this.inputs.isJump;
      case MarioStates.CROUCHING:
        return this.body.onFloor() && this.inputs.isDown;
      case MarioStates.FALLING:
        return !this.body.onFloor();
      case MarioStates.STANDING:
        return this.body.onFloor();
      default:
        return;
    }
  }

  switchState(state) {
    switch (state) {
      case MarioStates.JUMPING:
        this.setState(MarioStates.JUMPING);
        this.play('jump');
        this.body.velocity.y = this.getData('jumpVelocity');
        this.jumpTimer = this.scene.time.delayedCall(500, () => {
          this.switchState(MarioStates.FALLING);
        });
        break;
      case MarioStates.WALKING:
        this.setState(MarioStates.WALKING);
        this.play('walk');
        break;
      case MarioStates.CROUCHING:
        this.setState(MarioStates.CROUCHING);
        this.play('crouch');
        break;
      case MarioStates.FALLING:
        this.setState(MarioStates.FALLING);
        this.play('fall');
        break;
      default:
        this.setState(MarioStates.STANDING);
        this.play('stand');
        if (this.jumpTimer) {
          this.jumpTimer.destroy();
        }
        break;
    }
  }

  updateState() {
    switch (this.state) {
      case MarioStates.STANDING:
        if (this.checkState(MarioStates.JUMPING)) {
          this.switchState(MarioStates.JUMPING);
        } else if (this.checkState(MarioStates.WALKING)) {
          this.switchState(MarioStates.WALKING);
        } else if (this.checkState(MarioStates.CROUCHING)) {
          this.switchState(MarioStates.CROUCHING);
        } else if (this.checkState(MarioStates.FALLING)) {
          this.switchState(MarioStates.FALLING);
        }
        break;
      case MarioStates.WALKING:
        if (this.checkState(MarioStates.JUMPING)) {
          this.switchState(MarioStates.JUMPING);
        } else if (this.checkState(MarioStates.FALLING)) {
          this.switchState(MarioStates.FALLING);
        } else if (!this.checkState(MarioStates.WALKING)) {
          this.switchState(MarioStates.STANDING);
        }
        break;
      case MarioStates.CROUCHING:
        if (this.checkState(MarioStates.JUMPING)) {
          this.switchState(MarioStates.JUMPING);
        } else if (this.checkState(MarioStates.FALLING)) {
          this.switchState(MarioStates.FALLING);
        } else if (!this.checkState(MarioStates.CROUCHING)) {
          this.switchState(MarioStates.STANDING);
        }
        break;
      case MarioStates.FALLING:
      case MarioStates.JUMPING:
        if (this.checkState(MarioStates.STANDING)) {
          this.switchState(MarioStates.STANDING);
        }
        break;
      default:
        break;
    }
  }

  updateVelocity() {
    const directionX = this.inputs.isRight ? 1 : this.inputs.isLeft ? -1 : 0;

    this.setData('facingRight', this.inputs.isRight ? true : this.inputs.isLeft ? false : this.getData('facingRight'));
    this.setFlipX(!this.getData('facingRight'));

    switch (this.state) {
      case MarioStates.WALKING:
        this.body.setVelocityY(0);
      case MarioStates.FALLING:
      case MarioStates.JUMPING:
        this.body.setVelocityX(directionX * this.getData('walkVelocity'));
        break;
      case MarioStates.STANDING:
      case MarioStates.CROUCHING:
        this.body.setVelocity(0, 0);
        break;
      default:
        break;
    }
  }

  update() {
    this.updateState();
    this.updateVelocity();
  }
}
