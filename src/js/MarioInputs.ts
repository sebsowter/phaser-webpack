export default class MarioInputs {
  public scene: Phaser.Scene;
  public keys: any;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.keys = scene.input.keyboard.addKeys(
      "W,A,S,D,Z,X,C,up,left,down,right,space"
    );
  }

  public get pad(): Phaser.Input.Gamepad.Gamepad {
    const pad = this.scene.input.gamepad;

    if (pad && pad.gamepads && pad.gamepads.length) {
      return pad.gamepads[0];
    }

    return null;
  }

  public getPadH(isLeft: boolean): boolean {
    return this.pad && this.pad.axes[0].getValue() === (isLeft ? -1 : 1);
  }

  public getPadV(isUp: boolean): boolean {
    return this.pad && this.pad.axes[1].getValue() === (isUp ? -1 : 1);
  }

  public get padA(): boolean {
    return (
      this.pad &&
      this.pad.buttons.some(
        (button) => button.index % 2 === 0 && button.value === 1
      )
    );
  }

  public get padB(): boolean {
    return (
      this.pad &&
      this.pad.buttons.some(
        (button) => button.index % 2 === 1 && button.value === 1
      )
    );
  }

  public get up(): boolean {
    return this.keys.up.isDown || this.keys.W.isDown || this.getPadV(true);
  }

  public get down(): boolean {
    return this.keys.down.isDown || this.keys.S.isDown || this.getPadV(false);
  }

  public get left(): boolean {
    return this.keys.left.isDown || this.keys.A.isDown || this.getPadH(true);
  }

  public get right(): boolean {
    return this.keys.right.isDown || this.keys.D.isDown || this.getPadH(false);
  }

  public get jump(): boolean {
    return (
      this.keys.up.isDown ||
      this.keys.W.isDown ||
      this.keys.X.isDown ||
      this.keys.space.isDown
    );
  }
}
