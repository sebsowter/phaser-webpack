import Phaser from 'phaser';
import MarioInputs from './MarioInputs';
import MarioStates from './MarioStates';

/**
 * @class MarioSprite
 * @extends {Phaser.GameObjects.Sprite}
 */
export default class MarioSprite extends Phaser.GameObjects.Sprite {
  constructor(...config) {
    super(...config);

    // Create inputs
    this.inputs = new MarioInputs(this.scene);
    
    // Add Sprite to Scene
    this.scene.add.existing(this);
    
    // Enable physics
    this.scene.physics.world.enable(this);

    // Set body size
    this.body.setSize(16, 24);
    this.body.setOffset(0, 8);
    this.body.setCollideWorldBounds(true);
    
    // Set custom properties
    this.setData('flipX', false);
    this.setData('jumpVelocity', -256);
    this.setData('walkVelocity', 128);
    
    // Creat Animations
    this.scene.anims.create({
      key: 'stand',
      frameRate: 0,
      frames: this.scene.anims.generateFrameNumbers('player', {
        start: 0
      })
    });

    this.scene.anims.create({
      key: 'walk',
      frameRate: 12,
      frames: this.scene.anims.generateFrameNumbers('player', {
        start: 0,
        end: 2
      }),
      repeat: -1
    }); 

    this.scene.anims.create({
      key: 'jump',
      frameRate: 0,
      frames: this.scene.anims.generateFrameNumbers('player', {
        start: 2
      })
    });

    this.scene.anims.create({
      key: 'crouch',
      frameRate: 0,
      frames: this.scene.anims.generateFrameNumbers('player', {
        start: 3
      })
    });

    // Define actions
    this.actions = {
      jump: () => {
        this.setState(MarioStates.JUMPING);
        this.play('jump');
        this.body.velocity.y = this.getData('jumpVelocity');
        this.jumpTimer = this.scene.time.delayedCall(500, () => {
          this.switchState(MarioStates.FALLING);
        });
      },
      walk: () => {
        this.setState(MarioStates.WALKING);
        this.play('walk');
      },
      crouch: () => {
        this.setState(MarioStates.CROUCHING);
        this.play('crouch');
      },
      fall: () => {
        this.setState(MarioStates.FALLING);
        this.play('jump');
      },
      stand: () => {
        this.setState(MarioStates.STANDING);
        this.play('stand');
        if (this.jumpTimer) {
          this.jumpTimer.destroy();
        }
      }
    }

    // Define action checks
    this.check = {
      isWalking: () => this.body.onFloor() && (this.inputs.isLeft || this.inputs.isRight),
      isJumping: () => this.body.onFloor() && this.inputs.isJump,
      isCrouching: () => this.body.onFloor() && this.inputs.isDown,
      isFalling: () => !this.body.onFloor(),
      isStanding: () => this.body.onFloor()
    }
  }

  /**
   * preUpdate
   * 
   * @method preUpdate
   * @param {number} time
   * @param {number} delta
   * @return {Void}
   */
  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.updateState();
    this.updateDirection();
    this.updateVelocity();
  }

  /**
   * Check and update state
   * 
   * @method updateState
   * @return {Void} 
   */
  updateState() {
    switch (this.state) {
      case MarioStates.STANDING:
        if (this.check.isJumping()) {
          this.actions.jump();
        } else if (this.check.isWalking()) {
          this.actions.walk();
        } else if (this.check.isCrouching()) {
          this.actions.crouch();
        } else if (this.check.isFalling()) {
          this.actions.fall();
        }
        break;
      case MarioStates.WALKING:
      if (this.check.isJumping()) {
          this.actions.jump();
        } else if (this.check.isFalling()) {
          this.actions.fall();
        } else if (!this.check.isWalking()) {
          this.actions.stand();
        }
        break;
      case MarioStates.CROUCHING:
        if (this.check.isCrouching()) {
          this.actions.stand();
        }
        break;
      case MarioStates.FALLING:
      case MarioStates.JUMPING:
        if (this.check.isStanding()) {
          this.actions.stand();
        }
        break;
      default:
        break;
    }
  }

  /**
   * Update direction
   * 
   * @method updateDirection
   * @return {Void} 
   */
  updateDirection() {
    const flipX = this.inputs.isLeft ? true : this.inputs.isRight ? false : this.getData('flipX');
    
    this.setData('flipX', flipX);
    this.setFlipX(this.getData('flipX'));
  }

  /**
   * Update velocity
   * 
   * @method updateVelocity
   * @return {Void} 
   */
  updateVelocity() {
    switch (this.state) {
      case MarioStates.WALKING:
        this.body.setVelocityY(0);
      case MarioStates.FALLING:
      case MarioStates.JUMPING:
        this.body.setVelocityX((this.inputs.isRight ? 1 : this.inputs.isLeft ? -1 : 0) * this.getData('walkVelocity'));
        break;
      case MarioStates.STANDING:
      case MarioStates.CROUCHING:
        this.body.setVelocity(0, 0);
        break;
      default:
        break;
    }
  }
}
