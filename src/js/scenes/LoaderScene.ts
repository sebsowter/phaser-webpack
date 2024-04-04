export class LoaderScene extends Phaser.Scene {
  public preload() {
    this.load.audio("jump", "./assets/audio/jump.mp3");
    this.load.image("tiles", "./assets/images/tiles.png");
    this.load.spritesheet("goomba", "./assets/images/goomba.png", { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet("player", "./assets/images/player.png", { frameWidth: 16, frameHeight: 32 });
  }

  public create() {
    this.createAnimations();

    this.scene.start("game");
  }

  private createAnimations() {
    const animations: Phaser.Types.Animations.Animation[] = [
      { key: "player-idol", frames: this.anims.generateFrameNumbers("player", { frames: [0] }) },
      {
        key: "player-walk",
        frameRate: 12,
        frames: this.anims.generateFrameNumbers("player", { frames: [1, 2, 0] }),
        repeat: -1,
      },
      { key: "player-jump", frames: this.anims.generateFrameNumbers("player", { frames: [2] }) },
      { key: "player-crouch", frames: this.anims.generateFrameNumbers("player", { frames: [3] }) },
      { key: "goomba-default", frames: this.anims.generateFrameNumbers("goomba", { frames: [0] }) },
      {
        key: "goomba-walk",
        frameRate: 12,
        frames: this.anims.generateFrameNumbers("goomba", { frames: [0, 1] }),
        repeat: -1,
      },
      { key: "goomba-death", frames: this.anims.generateFrameNumbers("goomba", { frames: [2] }) },
    ];

    animations.forEach((animation) => this.anims.create(animation));
  }
}
