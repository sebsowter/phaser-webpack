import Phaser from 'phaser';

const PlayerState = {
  STANDING: 0,
  FALLING: 1,
  CROUCHING: 2,
  JUMPING: 3,
  WALKING: 4
};

export class Keys {
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

  get isSpace() {
    return this.keys.up.isDown || this.keys.W.isDown || this.keys.space.isDown;
  }
}
  
/**
 * 
 */
export default class MarioScene extends Phaser.Scene {
  constructor(config) {
    super(config);
  }
  
  init() {
    console.log('init');
  }
  
  preload() {
    console.log('preload');

    // Load tilemap
    this.load.tilemapTiledJSON('World1', './assets/tilemaps/tilemap.json');

    // Load tiles image
    this.load.image('tiles', './assets/images/tiles.gif');

    // Load player spritesheet
    this.load.spritesheet('player', './assets/images/player.gif', {
      frameWidth: 16,
      frameHeight: 32
    });
  }
  
  create() {
    console.log('onCreate');

    this.keys = new Keys(this);
    
    const map = this.make.tilemap({
        key: 'World1'
    });
    const tileset = map.addTilesetImage('tiles');
    console.log('map', map);
    //const tileset = map.addTilesetImage('tiles');
    console.log('tileset', tileset);
    this.layer = map.createDynamicLayer(0, tileset, 0, 0);
    this.layer.setCollision(2);
    this.layer.setCollision(8);
    console.log('this.layer', this.layer);

    //this.player = new Player(this, 32, 32, this.layer, this.enemiesGroup);
    
    this.anims.create({
      key: "stand",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 0
      }),
      frameRate: 0,
      repeat: -1
    });

    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 0
      }),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("player", {
        start: 2,
        end: 2
      }),
      frameRate: 0,
      repeat: -1
    });

    this.anims.create({
      key: "fall",
      frames: this.anims.generateFrameNumbers("player", {
        start: 2,
        end: 2
      }),
      frameRate: 0,
      repeat: -1
    });

    this.anims.create({
      key: "crouch",
      frames: this.anims.generateFrameNumbers("player", {
        start: 3,
        end: 3
      }),
      frameRate: 0,
      repeat: -1
    });
    
    this.player = this.add.sprite(2 * 16, 11 * 16, "player", this.width, this.height, 0, 0)
      .setData('health', 1) 
      .setData('speed', 96);

    this.player.anims.play("stand", true);

    this.physics.world.enable(this.player);
    this.physics.add.collider(this.player, this.layer);

    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.startFollow(this.player);
  }
  
  startJump() {
    this.player.setState(PlayerState.JUMPING);
    this.player.body.velocity.y = -224;
    this.jumpTimer = this.time.delayedCall(500, () => {
      this.player.setState(PlayerState.FALLING);
    });
  }
  
  update() {
    const isOnFloor = () => {
      //console.log('this.player', this.player);
      return this.player.body.onFloor();
    }
    const isWalking = () => isOnFloor() && (this.keys.isLeft || this.keys.isRight);
    const isJumping = () => isOnFloor() && this.keys.isSpace;
    const isCrouching = () => !isOnFloor() && this.keys.isDown;
    const isFalling = () => !isOnFloor();
    console.log('isWalking', this.player.state);

    // Update player state
    switch (this.player.state) {
      case PlayerState.STANDING:
        if (isJumping()) {
          this.startJump();
          //this.player.setState(PlayerState.JUMPING);
        } else if (isWalking()) {
          this.player.setState(PlayerState.WALKING);
        } else if (isCrouching()) {
          this.player.setState(PlayerState.CROUCHING);
        } else if (isFalling()) {
          this.player.setState(PlayerState.FALLING);
        }
        break;
      case PlayerState.WALKING:
        if (isJumping()) {
          this.startJump();
          //this.player.setState(PlayerState.JUMPING);
        } else if (isFalling()) {
          this.player.setState(PlayerState.FALLING);
        } else if (!isWalking()) {
          this.player.setState(PlayerState.STANDING);
        }
        break;
      case PlayerState.CROUCHING:
        if (isJumping()) {
          this.startJump();
          //this.player.setState(PlayerState.JUMPING);
        } else if (isFalling()) {
          this.player.setState(PlayerState.FALLING);
        } else if (!isCrouching()) {
          this.player.setState(PlayerState.STANDING);
        }
        break;
      case PlayerState.FALLING:
      case PlayerState.JUMPING:
        if (isOnFloor()) {
          this.player.setState(PlayerState.STANDING);
        }
        break;
      default:
        break;
    }

    var direction = new Phaser.Geom.Point(
      this.keys.isLeft ? -1 : this.keys.isRight ? 1 : 0,
      this.keys.isUp ? -1 : this.keys.isDown ? 1 : 0
    );

    // Set direction
    //this.player.scale.x = this.facing = direction.x === 0 ? this.facing : direction.x;

    // Update velocity
    switch (this.player.state) {
      case PlayerState.WALKING:
      console.log('direction', direction.x );
        this.player.body.velocity.y = 0;
      case PlayerState.FALLING:
      case PlayerState.JUMPING:
        this.player.body.velocity.x = direction.x * this.player.getData('speed');
        break;
      case PlayerState.STANDING:
      case PlayerState.CROUCHING:
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        break;
      default:
        break;
    }
  }
}

