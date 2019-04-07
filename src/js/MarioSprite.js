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
    
    // Add Sprite to Scene and enable physics
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    console.log('this.scene.physics.world', this.scene.physics.world);

    // Set body size
    this.body.setSize(16, 24);
    this.body.setOffset(0, 8);
    this.body.setCollideWorldBounds(true);
    
    // Set custom properties
    this.setData('facingRight', true);
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

    this.actions = {
      jump: () => {
        this.setState(MarioStates.JUMPING);
        this.play('jump');
        this.body.velocity.y = this.getData('jumpVelocity');
        this.jumpTimer = this.scene.time.delayedCall(500, () => {
          this.switchState(MarioStates.FALLING);
        });
      }
    }
  }

  /**
   * preUpdate
   * 
   * @method update
   * @return {Void} 
   */
  //preUpdate() {
  //}

  /**
   * Update
   * 
   * @method update
   * @return {Void} 
   */
  update() {
    this.updateState();
    this.updateDirection();
    this.updateVelocity();
  }

  /**
   * Update direction
   * 
   * @method updateDirection
   * @return {Void} 
   */
  updateDirection() {
    const facingRight = this.inputs.isRight ? true : this.inputs.isLeft ? false : this.getData('facingRight');
    
    this.setData('facingRight', facingRight);
    this.setFlipX(!this.getData('facingRight'));
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

  /**
   * Check and update state
   * 
   * @method updateState
   * @return {Void} 
   */
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
        if (!this.checkState(MarioStates.CROUCHING)) {
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

  /**
   * Check conditions for new state
   * 
   * @method checkState
   * @param {Number} state 
   * @return {Boolean} 
   */
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

  /**
   * Switch to new state
   * 
   * @method switchState
   * @param {Number} state 
   * @return {Void} 
   */
  switchState(state) {
    switch (state) {
      case MarioStates.JUMPING:
        this.actions.jump();
        break;
      case MarioStates.WALKING:
        console.log('walk');
        this.setState(MarioStates.WALKING);
        this.play('walk', true);
        break;
      case MarioStates.CROUCHING:
        this.setState(MarioStates.CROUCHING);
        this.play('crouch', true);
        break;
      case MarioStates.FALLING:
        this.setState(MarioStates.FALLING);
        this.play('jump');
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
}
