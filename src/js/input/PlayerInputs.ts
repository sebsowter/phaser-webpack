import Inputs from "./Inputs";

export default class PlayerInputs extends Inputs {
  public get jump() {
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
}
