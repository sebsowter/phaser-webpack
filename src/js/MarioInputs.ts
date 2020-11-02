export default class MarioInputs {
  public scene: Phaser.Scene;
  public keys: any;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.keys = scene.input.keyboard.addKeys(
      "W,A,S,D,Z,X,C,up,left,down,right,space"
    );
  }

  public get up(): boolean {
    return this.keys.up.isDown || this.keys.W.isDown || this.padAxisV === -1;
  }

  public get down(): boolean {
    return this.keys.down.isDown || this.keys.S.isDown || this.padAxisV === 1;
  }

  public get left(): boolean {
    return this.keys.left.isDown || this.keys.A.isDown || this.padAxisH === -1;
  }

  public get right(): boolean {
    return this.keys.right.isDown || this.keys.D.isDown || this.padAxisH === 1;
  }

  public get jump(): boolean {
    return (
      this.up ||
      this.keys.Z.isDown ||
      this.keys.X.isDown ||
      this.keys.C.isDown ||
      this.keys.space.isDown ||
      this.padA ||
      this.padB
    );
  }

  private get padA(): boolean {
    return this.padButtons.some(
      (button: Phaser.Input.Gamepad.Button) =>
        button.index % 2 === 0 && button.value === 1
    );
  }

  private get padB(): boolean {
    return this.padButtons.some(
      (button: Phaser.Input.Gamepad.Button) =>
        button.index % 2 === 1 && button.value === 1
    );
  }

  private get padAxisH(): number {
    if (this.pad) {
      return this.pad.axes[0].getValue();
    }

    return 0;
  }

  private get padAxisV(): number {
    if (this.pad) {
      return this.pad.axes[1].getValue();
    }

    return 0;
  }

  private get padButtons(): Phaser.Input.Gamepad.Button[] {
    if (this.pad) {
      return this.pad.buttons;
    }

    return [];
  }

  private get pad(): Phaser.Input.Gamepad.Gamepad {
    const pad = this.scene.input.gamepad;

    if (pad && pad.gamepads && pad.gamepads.length) {
      return pad.gamepads[0];
    }

    return null;
  }
}
