import "phaser";
import MarioScene from "./MarioScene";
import LoaderScene from "./LoaderScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 256,
  height: 224,
  zoom: 2,
  input: {
    keyboard: true,
    gamepad: true,
    mouse: false,
    touch: false,
  },
  render: {
    pixelArt: true,
    antialias: false,
    antialiasGL: false,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: {
        y: 500,
      },
    },
  },
  scene: [LoaderScene, MarioScene],
};

window.addEventListener("load", function () {
  new Phaser.Game(config);
});
