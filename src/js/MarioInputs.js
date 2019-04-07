/**
 * MarioInputs
 * 
 * export default {Class}
 */
export default class MarioInputs {
  constructor(scene) {
    this.keys = scene.input.keyboard.addKeys('W,A,S,D,up,left,down,right,space');
  }

  get isUp() {
    return this.keys.up.isDown || this.keys.W.isDown;
  }

  get isDown() {
    return this.keys.down.isDown || this.keys.S.isDown;
  }

  get isLeft() {
    return this.keys.left.isDown || this.keys.A.isDown;
  }

  get isRight() {
    return this.keys.right.isDown || this.keys.D.isDown;
  }

  get isJump() {
    return this.keys.up.isDown || this.keys.W.isDown || this.keys.space.isDown;
  }
}
