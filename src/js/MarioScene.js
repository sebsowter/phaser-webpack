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
    return this.keys.space.isDown;
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


/*
// Define the various states that the player can be in
var PlayerState = {
    STANDING: 'standing',
    FALLING: 'falling',
    LADDER: 'ladder',
    CROUCHING: 'crouching',
    JUMPING: 'jumping',
    WALKING: 'walking',
    CLIMBING: 'climbing'
};

// Store the indexes of important tiles
var Tiles = {
    FLOOR: 2,
    BRICK: 11,
    LADDER: 12,
    LADDER_TOP: 3,
    JUMP_THROUGH_LEFT: 7,
    JUMP_THROUGH_TOP: 8,
    JUMP_THROUGH_RIGHT: 9
};


/**
 * @method createLevel
function createLevel() {

    // Start arcade physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 512;

    // Create tilemap
    this.map = this.game.add.tilemap('level');
    this.map.addTilesetImage('tilesetMain', 'tiles');

    // Create layer
    this.layerMain = this.map.createLayer('layerMain');
    this.layerMain.resizeWorld();
    this.layerMain.debug = this.debug;

    // Set collision tiles
    this.map.setCollision(Tiles.FLOOR, true, 'layerMain');
    this.map.setCollision(Tiles.BRICK, true, 'layerMain');
    this.map.setCollision(Tiles.LADDER_TOP, true, 'layerMain');

    // Set jump through platform tiles
    setLadderTopTiles.call(this, this.map, Tiles.LADDER_TOP);
    //this.setCollisionJumpThrough(this.map, Tiles.LADDER_TOP);

    // Set jump through platform tiles
    setLadderTiles.call(this, this.map, Tiles.LADDER);

    // Set jump through platform tiles
    setCollisionJumpThrough(this.map, Tiles.JUMP_THROUGH_LEFT);
    setCollisionJumpThrough(this.map, Tiles.JUMP_THROUGH_TOP);
    setCollisionJumpThrough(this.map, Tiles.JUMP_THROUGH_RIGHT);
}

/**
 * @method createPlayer
function createPlayer() {

    // Create player sprite
    var sprite = this.game.add.sprite(2 * 16, 11 * 16, 'player');

    // Create player
    this.player = new Player(sprite, this.keys, this.game.physics.arcade, this.layerMain);
    
    // Enable physics
    this.game.physics.enable(sprite);

    // Init body
    this.player.initBody();

    // Set camera to follow player
    this.game.camera.follow(this.player.getSprite());
}


/**
 * Game
 *
 * @constructor
Game = function() {
    this.debug = false;
    this.map = null;
    this.layerMain = null;
    this.player = null;
    this.keys = null;
};

/**
 * @method init
Game.prototype.init = function() {

    // Create keys
    this.keys = {
        jump: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
        up: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
        down: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
        left: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
        right: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    };
};

/**
 * @method preload
Game.prototype.preload = function() {

    // Load tilemap
    this.game.load.tilemap('level', 'js/tilemap.json', null, Phaser.Tilemap.TILED_JSON);

    // Load tiles image
    this.game.load.image('tiles', 'images/tiles.gif');

    // Load player spritesheet
    this.game.load.spritesheet('player', 'images/player.gif', 16, 32);
};

/**
 * @method create
Game.prototype.create = function() {
    createLevel.call(this);
    createPlayer.call(this);
};

/**
 * @method update
Game.prototype.update = function() {

    // Call player preUpdate
    //.player.preUpdate();

    // Call physics overlap and collision
    //this.game.physics.arcade.overlap(this.player.sprite, this.layerMain, handleOverlap.bind(this));
   // this.game.physics.arcade.collide(this.player.sprite, this.layerMain, handleCollide.bind(this));

    // Call player update
    this.player.update();
}

/**
 * @method render
Game.prototype.render = function() {
    if (this.debug) {
        this.game.debug.body(this.player.sprite);
    }
};

/*
 * --------------------------------------------------------------------------------
 * Player
 * --------------------------------------------------------------------------------
 */

/**
 * Player
 *
 * @constructor
 * @param { Phaser.Sprite } sprite
 * @param { Object } keys
Player = function(sprite, keys, physics, collisionLayer) {

    // Keys
    this.physics = physics;

    // Keys
    this.collisionLayer = collisionLayer;

    // Keys
    this.keys = keys;

    // Direction the player is facing (1 or -1)
    this.facing = 1;

    // Walking speed of the player
    this.speed = 96;

    // Climbing speed of the player
    this.speedClimbing = 64;

    // Strength
    this.strength = 0.1;

    // Current state
    this.state = PlayerState.STANDING;

    // Jump timer
    this.jumpTimer = null;

    // Overlapping ladder
    //this.overlapLadder = false;

    // Sprite
    this.sprite = sprite;

    // Give sprite full health
    this.sprite.health = 1;

    // Track whether sprite is on a ladder tile
    this.sprite.data.isOnLadderTile = false;
    this.sprite.data.isOnLadderTop = false;

    // Set anchor to center
    this.sprite.anchor.setTo(0.5, 0.5);

    // Animations
    this.sprite.animations.add('stand', [0]);
    this.sprite.animations.add('walk', [0, 1, 2, 1], 12, true);
    this.sprite.animations.add('jump', [2]);
    this.sprite.animations.add('fall', [2]);
    this.sprite.animations.add('crouch', [3]);
    this.sprite.animations.add('climb', [4, 5], 12, true);
    this.sprite.animations.add('ladder', [4]);
};

/**
 * @method initBody
 *
Player.prototype.initBody = function() {
    setBodySize(this.sprite.body);

    this.sprite.body.bounce.y = 0;
    this.sprite.body.collideWorldBounds = true;
};

/**
 * @method initBody
 *
Player.prototype.getSprite = function() {
    return this.sprite;
};

/*
 * --------------------------------------------------------------------------------
 * Update
 * --------------------------------------------------------------------------------
 */

/**
 * @method update
 *
Player.prototype.update = function() {
    this.updateCollisions();
    this.updateState();
    this.updateVelocity();
};

/**
 * @method update
 *
Player.prototype.handleCollision = function(sprite1, sprite2) {
    console.log('sprite2', sprite2);
};


/**
 * @method update
 *
Player.prototype.updateCollisions = function() {
    this.sprite.data.isOnLadderTile = false;
    this.sprite.data.isOnLadderTop = false;

    // Call player preUpdate
    //this.player.preUpdate();

    // Call physics overlap and collision
    //this.game.physics.arcade.overlap(this.player.sprite, this.layerMain, handleOverlap.bind(this));
   this.physics.collide(this.sprite, this.collisionLayer, this.handleCollision.bind(this));
};

/**
 * @method updateState
 *
Player.prototype.updateState = function() {

    // Check for state changes
    switch (this.state) {
        case PlayerState.FALLING:
            if (isClimbing()) {
                this.player.setState(PlayerState.CLIMBING);
            } else if (isOnFloor()) {
                this.player.setState(PlayerState.STANDING);
            }
            break;
        case PlayerState.STANDING:
            if (isJumping()) {
                this.player.setState(PlayerState.JUMPING);
            } else if (isWalking()) {
                this.player.setState(PlayerState.WALKING);
            } else if (isClimbing()) {
                this.player.setState(PlayerState.CLIMBING);
            } else if (isOnLadder()) {
                this.player.setState(PlayerState.LADDER);
            } else if (isCrouching()) {
                this.player.setState(PlayerState.CROUCHING);
            } else if (isFalling()) {
                this.player.setState(PlayerState.FALLING);
            }
            break;
        case PlayerState.JUMPING:
            if (isOnFloor()) {
                this.player.setState(PlayerState.STANDING);
            }
            break;
        case PlayerState.WALKING:
            if (isJumping()) {
                this.player.setState(PlayerState.JUMPING);
            } else if (isClimbing()) {
                this.player.setState(PlayerState.CLIMBING);
            } else if (isOnLadder()) {
                this.player.setState(PlayerState.LADDER);
            } else if (isFalling()) {
                this.player.setState(PlayerState.FALLING);
            } else if (!isWalking()) {
                this.player.setState(PlayerState.STANDING);
            }
            break;
        case PlayerState.CLIMBING:
            if (isJumping()) {
                this.player.setState(PlayerState.JUMPING);
            } else if (!isClimbing() && isOnLadder()) {
                this.player.setState(PlayerState.LADDER);
            } else if (!isClimbing()) {
                this.player.setState(PlayerState.STANDING);
            }
            break;
        case PlayerState.LADDER:
            if (isJumping()) {
                this.player.setState(PlayerState.JUMPING);
            } else if (isClimbing()) {
                this.player.setState(PlayerState.CLIMBING);
            } else if (!isOnLadder()) {
                this.player.setState(PlayerState.FALLING);
            }
            break;
        case PlayerState.CROUCHING:
            if (isJumping()) {
                this.player.setState(PlayerState.JUMPING);
            } else if (isClimbing()) {
                this.player.setState(PlayerState.CLIMBING);
            } else if (!isCrouching()) {
                this.player.setState(PlayerState.STANDING);
            } else if (isFalling()) {
                this.player.setState(PlayerState.FALLING);
            }
            break;
        default:
            break;
    }
};

/**
 * @method updateVelocity
 *
Player.prototype.updateVelocity = function() {
    var direction = new Phaser.Point(
        this.keys.left.isDown ? -1 : this.keys.right.isDown ? 1 : 0,
        this.keys.up.isDown ? -1 : this.keys.down.isDown ? 1 : 0
    );

    // Set direction
    this.sprite.scale.x = this.facing = direction.x === 0 ? this.facing : direction.x;

    // Update velocity
    switch (this.state) {
        case PlayerState.CLIMBING:
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = direction.y * this.speedClimbing;
            this.sprite.x = this.getLockX(this.sprite.x);
            break;
        case PlayerState.LADDER:
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
            this.sprite.x = this.getLockX(this.sprite.x);
            break;
        case PlayerState.WALKING:
            this.sprite.body.velocity.y = 0;
        case PlayerState.FALLING:
        case PlayerState.JUMPING:
            this.sprite.body.velocity.x = direction.x * this.speed;
            break;
        case PlayerState.STANDING:
        case PlayerState.CROUCHING:
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
            break;
        default:
            break;
    }
};

/*
 * --------------------------------------------------------------------------------
 * Setters
 * --------------------------------------------------------------------------------
 */

/**
 * @method setState
 * @param { String } state
 *
Player.prototype.setState = function(state) {
    console.log('[PlayerState]: ' + state);

    this.state = state;

    switch (this.state) {
        case PlayerState.FALLING:
            setBodySize(this.sprite.body);
            this.setOnLadder(false);
            this.setAnimation('fall');
            break;
        case PlayerState.STANDING:
            setBodySize(this.sprite.body);
            this.setOnLadder(false);
            this.setAnimation('stand');
            this.endJump();
            break;
        case PlayerState.JUMPING:
            setBodySize(this.sprite.body);
            this.setOnLadder(false);
            this.setAnimation('jump');
            this.startJump();
            break;
        case PlayerState.WALKING:
            setBodySize(this.sprite.body);
            this.setOnLadder(false);
            this.setAnimation('walk');
            break;
        case PlayerState.CLIMBING:
            setBodySize(this.sprite.body);
            this.setOnLadder(true);
            this.setAnimation('climb');
            break;
        case PlayerState.LADDER:
            setBodySize(this.sprite.body);
            this.setOnLadder(true);
            this.setAnimation('ladder');
            break;
        case PlayerState.CROUCHING:
            setBodySize(this.sprite.body, 'small');
            this.setOnLadder(false);
            this.setAnimation('crouch');
            break;
        default:
            break;
    }
};

/**
 * @method setBodySize
 * @param { String } size
 *
function setBodySize(body, size = 'large') {
    switch (size) {

        // For crouching and crawling
        case 'small':
            body.setSize(16, 16, 0, 16);
            break;

        // Default body size
        case 'large':
        default:
            body.setSize(16, 24, 0, 8);
            break;
    }
}

/**
 * @method setGravity
 * @param { Boolean } bool
 *
Player.prototype.setGravity = function(bool) {
    this.sprite.body.allowGravity = bool;
};

/**
 * @method setAnimation
 * @param { String } anim
 *
Player.prototype.setAnimation = function(anim) {
    this.sprite.animations.play(anim);
};

/**
 * @method setOnLadder
 * @param { Boolean } bool
 *
Player.prototype.setOnLadder = function(bool) {
    this.setGravity(!bool);
    //this.setLadderTopsCollide(!bool);
};

/**
 * @method setOnLadder
 * @param { Boolean } bool
 *
Player.prototype.setOverlapLadder = function(bool) {
    this.sprite.data.isOnLadderTile = bool;
};

/**
 * @method setLadderTopsCollide
 * @param { Boolean } bool
 *
Player.prototype.setLadderTopsCollide = function(bool) {
    var map = this.sprite.game.world.children[0].map;

    this.setTileCollides(map, Tiles.LADDER_TOP, bool);
};

/**
 * @method setTileCollides
 * @param { Phaser.Tilemap } map
 * @param { Number } index
 * @param { Boolean } bool
 *
Player.prototype.setTileCollides = function(map, index, bool) {
    for (var x = 0; x < map.width; x++) {
        for (var y = 0; y < map.height; y++) {
            var tile = map.getTile(x, y);

            if (tile.index === index) {
                tile.setCollision(bool, bool, bool, bool);
            }
        }
    }
};

/*
 * --------------------------------------------------------------------------------
 * Getters
 * --------------------------------------------------------------------------------
 */

/**
 * @method getState
 * @return { String }
 *
Player.prototype.getState = function() {
    return this.state;
};

/**
 * @method getLockX
 * @param { Number } x
 * @return { Number }
 *
Player.prototype.getLockX = function(x) {
    return Math.floor(x / 16) * 16 + 8;
};

/*
 * --------------------------------------------------------------------------------
 * Jump
 * --------------------------------------------------------------------------------
 */

/**
 * @method startJump
 *
Player.prototype.startJump = function() {
    this.sprite.body.velocity.y = -224;
    this.jumpTimer = this.sprite.game.time.events.add(Phaser.Timer.SECOND * 0.5, function() {
        this.player.setState(PlayerState.FALLING);
    }, this);
};

/**
 * @method endJump
 *
Player.prototype.endJump = function() {
     this.sprite.game.time.events.remove(this.jumpTimer);
};

/*
 * --------------------------------------------------------------------------------
 * Check state
 * --------------------------------------------------------------------------------
 */

/**
 * @method isWalking
 * @return { Boolean }
 *
Player.prototype.isWalking = function() {
    return isOnFloor() && (this.keys.left.isDown || this.keys.right.isDown);
};

/**
 * @method isJumping
 * @return { Boolean }
 *
Player.prototype.isJumping = function() {
    return (isOnFloor() || this.sprite.data.isOnLadderTile) && this.keys.jump.isDown;
};

/**
 * @method isCrouching
 * @return { Boolean }
 *
Player.prototype.isCrouching = function() {
    return isOnFloor() && this.keys.down.isDown;
};

/**
 * @method isFalling
 * @return { Boolean }
 *
Player.prototype.isFalling = function() {
    return !isOnFloor();
};

/**
 * @method isClimbing
 * @return { Boolean }
 *
Player.prototype.isClimbing = function() {
    return isTryingToClimbUp() || isTryingToClimbDown() || isTryingToClimb();
};

/**
 * @method isTryingToClimb
 * @return { Boolean }
 *
Player.prototype.isTryingToClimb = function() {
    return isOnLadder() && (this.keys.up.isDown || this.keys.down.isDown);
};

/**
 * @method isTryingToClimbDown
 * @return { Boolean }
 *
Player.prototype.isTryingToClimbDown = function() {
    //return this.sprite.data.isOnLadderTop && this.keys.down.isDown;
};

/**
 * @method isTryingToClimbUp
 * @return { Boolean }
 *
Player.prototype.isTryingToClimbUp = function() {
    return this.sprite.data.isOnLadderTile && isOnFloor() && !this.sprite.data.isOnLadderTop && this.keys.up.isDown;
    //return this.sprite.data.isOnLadderTile && isOnFloor() && this.keys.up.isDown;
};

/**
 * @method isOnLadder
 * @return { Boolean }
 *
Player.prototype.isOnLadder = function() {
    return this.sprite.data.isOnLadderTile && !isOnFloor();
};

/**
 * @method isOnFloor
 * @return { Boolean }
 *
Player.prototype.isOnFloor = function() {
    return this.sprite.body.onFloor();
};


 */
