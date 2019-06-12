/**
 * @classdesc
 * Represents keyboard inputs for Mario.
 * 
 * @class MarioInputs
 * 
 * @param {Phaser.Scene} scene
 */
export default class MarioInputs {
  constructor(scene) {
    this.keys = scene.input.keyboard.addKeys('W,A,S,D,up,left,down,right,space');
  }

  get up() {
    return this.keys.up.isDown || this.keys.W.isDown;
  }

  get down() {
    return this.keys.down.isDown || this.keys.S.isDown;
  }

  get left() {
    return this.keys.left.isDown || this.keys.A.isDown;
  }

  get right() {
    return this.keys.right.isDown || this.keys.D.isDown;
  }

  get jump() {
    return this.keys.up.isDown || this.keys.W.isDown || this.keys.space.isDown;
  }
}
