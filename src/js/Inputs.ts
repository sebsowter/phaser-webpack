interface Keys {
  W: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
  Z: Phaser.Input.Keyboard.Key;
  X: Phaser.Input.Keyboard.Key;
  C: Phaser.Input.Keyboard.Key;
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  enter: Phaser.Input.Keyboard.Key;
  space: Phaser.Input.Keyboard.Key;
  comma: Phaser.Input.Keyboard.Key;
  period: Phaser.Input.Keyboard.Key;
}

export default class Inputs {
  private _scene: Phaser.Scene;
  private _keys: Keys;
  private _padIndex: number = 0;

  constructor(scene: Phaser.Scene) {
    this._scene = scene;
    this._keys = this._scene.input.keyboard.addKeys(
      "W,A,S,D,Z,X,C,up,left,down,right,space,enter,comma,period"
    ) as Keys;
  }

  public get keys(): Keys {
    return this._keys;
  }

  public get left(): boolean {
    return this.keys.left.isDown || this.keys.A.isDown || this.padAxisH === -1;
  }

  public get right(): boolean {
    return this.keys.right.isDown || this.keys.D.isDown || this.padAxisH === 1;
  }

  public get up(): boolean {
    return this.keys.up.isDown || this.keys.W.isDown || this.padAxisV === -1;
  }

  public get down(): boolean {
    return this.keys.down.isDown || this.keys.S.isDown || this.padAxisV === 1;
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
      (button) => button.index % 2 === 1 && button.value === 1
    );
  }

  private get padB(): boolean {
    return this.padButtons.some(
      (button) => button.index % 2 === 0 && button.value === 1
    );
  }

  private get padAxisH(): number {
    if (this.pad) {
      const [x] = this.pad.axes;

      return x.getValue();
    }

    return 0;
  }

  private get padAxisV(): number {
    if (this.pad) {
      const [_, y] = this.pad.axes;

      return y.getValue();
    }

    return 0;
  }

  private get padButtons(): Phaser.Input.Gamepad.Button[] {
    return this.pad?.buttons || [];
  }

  private get pad(): Phaser.Input.Gamepad.Gamepad {
    const pad = this._scene.input.gamepad;

    if (pad.gamepads.length > this._padIndex) {
      return pad.gamepads[this._padIndex];
    }

    return;
  }
}
