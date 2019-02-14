import Phaser from 'phaser';

class ROBO_CATS {
  constructor() {
    // Global vars
    this.game = null;
    this.debug = false;
    this.map = null;
    this.mapLayer = null;
    this.bullets = null;
    this.bulletDirection = null;
    this.player = {
        view: null,
        strength: 0.4,
        speed: 96,
        hitArea: null,
        hitArray: [],
        direction: {
            'x': 1,
            'y': 0
        }
    };
    this.isAttacking = false;
    this.isBuilding = false;
    this.enemies = null;
    this.crates = null;
    this.cursors = null;
    this.keys = {
        'space': null
    };
    this.nextFire = 0;
    this.fireRate = 250;
  }

  /**
   * Create this.enemies
   * @method: createthis.enemies
   */
  createEnemies() {

    // Create this.enemies group
    this.enemies = this.game.add.group();
    this.enemies.enableBody = true;
    this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

    // Spawn enemy
    this.spawnEnemy();
  }

  /**
   * Create objects such as crates
   * @method: createObjects
   */
  createObjects() {
    var positions = [
      new Phaser.Point((27 * 16) - 8, 28 * 16),
      new Phaser.Point((28 * 16) - 8, 28 * 16)
    ];

    // Create group
    this.crates = this.game.add.group();
    this.crates.enableBody = true;
    this.crates.physicsBodyType = Phaser.Physics.ARCADE;

    // Create crates
    for(var i = 0; i < positions.length; i++) {
      var position = positions[i],
      crate = this.crates.create(position.x, position.y, 'crate');
      crate.anchor.setTo(0.5, 0.5);
      crate.health = 0.2;
      crate.body.setSize(12, 12, 2, 18);
      crate.body.immovable = true;

      this.game.physics.enable(crate);
    }
  }

  /**
   * Create this.enemies
   * @method: createUi
   */
  createUi() {

    var ui = this.game.add.sprite(0, 112, 'ui');
    ui.fixedToCamera = true;

    /*

    // Create this.enemies group
    ui = this.game.add.group();
    ui.fixedToCamera = true;

    points = this.game.add.text(10, 8, '496,062,350', {font: "10px Arial", fill: "#ffffff", align: "center"}, ui);
    rescued = this.game.add.text(this.game.canvas.width - 10, this.game.canvas.height - 2, 'x8', {font: "21px Arial", fill: "#ffffff", align: "center"}, ui);
    rescued.anchor.setTo(1, 1);

    addText();
    */
  }

  /**
   * Set game scale for old skool pixelation
   * @method: setGameScale
   * @param: {scale} ratio to scale
   */
  setGameScale(scale) {

    // Scale the game
    this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.game.scale.setUserScale(scale, scale);

    // Round rendering to nearest pixels
    this.game.renderer.renderSession.roundPixels = true;  

    // Apply crisp rendering
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)
  }

  /**
   * -----------------------------------------------------------------------------------------------------------------------------
   * Enemy
   */

  /**
   * Spawn enemy
   * @method: spawnEnemy
   */
  spawnEnemy() {
  }

  /**
   * Wounds an enemy
   * @method: woundAgent
   * @param: {enemy}
   */
  createDeath(crate) {

    // Add animation
    var death = this.game.add.sprite(crate.x, crate.y, "crate_death");
    death.anchor.setTo(0.5, 0.5);

    death.animations.add("crate_death");
    death.animations.play("crate_death", 12, false, true);

    crate.kill();
  }

  /**
   * Adds enemy death animation
   * @method: woundAgent
   * @param: {enemy}
   */
  addText() {
    //text = this.game.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2, 'Game Over', {font: "24px Arial", fill: "#ffffff", align: "center"}, ui);
    //text.anchor.setTo(0.5, 0.5);

    console.log('addText');
  }

  /**
   * Gets whether the player.view has already hit enemy
   * @method: playerEnemyHits
   * @param: {enemy}
   * @return: boolean
   */
  playerEnemyHits(enemy) {
    for(var i = 0; i < player.hitArray.length; i++) {
      if(player.hitArray[i] === enemy)
        return true;
    }

    return false;
  }

  /**
   * Create this.enemies
   * @method: playerBuild
   */
  playerBuild(direction) {

    // Prevent further attacks
    isAttacking = true;
    isBuilding = true;

    // Reset this.enemies
    player.hitArray = [];

    // Play animation
    player.view.animations.play(direction.y < 0 ? 'upBuild' : 'downBuild');
  }

  /**
   * Create this.enemies
   * @method: playerAttack
   */
  playerAttack(direction) {

    // Prevent further attacks
    isBuilding = false;
    isAttacking = true;

    // Keep track of last direction ensuring x is not zero
    //bulletDirection.x = direction.x === 0 ? player.direction.x : direction.x;
    //bulletDirection.y = direction.x === 0 && direction.y === 0 ? player.direction.y : direction.y;

    fire(direction);

    // Play animation
    //player.view.animations.play(direction.y < 0 ? 'upSwipe' : 'downSwipe', 12, false, false);

    //player.hitArea.scale.x = direction.x;

    // Add player.hitArea
    //player.view.addChild(player.hitArea);
    /*
    // Add hit area
    this.game.time.events.add(Phaser.Timer.SECOND * 1, function() {

      // Reset attack
      isAttacking = false;

      // Remove player.hitArea
      player.view.removeChild(player.hitArea);

      player.hitArea.body.x = 0;
      player.hitArea.body.y = 0;

    }, this);
    */
  }

  fire(direction) {

    if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
      this.nextFire = this.game.time.now + this.fireRate;

      var bullet = bullets.getFirstDead();

      bullet.reset(this.player.view.x, this.player.view.y - 8);
      //bullet.animations.add('downStanding', [0], 0, true);

      if(this.direction.x !== 0 && this.direction.y !== 0) {
        bullets.callAll('animations.add', 'animations', 'projectile1', [5, 4], 12, false);
        bullets.callAll('play', null, 'projectile1');
      } else if(this.direction.x !== 0) {
        bullets.callAll('animations.add', 'animations', 'projectile2', [1, 0], 12, false);
        bullets.callAll('play', null, 'projectile2');
      } else if(this.direction.y !== 0) {
        bullets.callAll('animations.add', 'animations', 'projectile3', [3, 2], 12, false);
        bullets.callAll('play', null, 'projectile3');
      }

      // bullets.animations.currentAnim.setFrame(0);

      //this.game.physics.arcade.moveToPointer(bullet, 300);
      bullet.body.velocity.y = this.direction.y * 200;
      //bullet.body.rotate = 90 * (Math.PI / 180);
      bullet.body.velocity.x = this.direction.x * 200;
      bullet.scale.x = this.direction.x < 0 ? -1 : 1;
      bullet.scale.y = this.direction.y < 0 ? -1 : 1;
    }
  }

  /**
   * -----------------------------------------------------------------------------------------------------------------------------
   * Collision handlers
   */

  /**
   * Spawn enemy
   * @method: onCollisionPlayerEnemy
   */
  onCollisionPlayerMap(playerHitArea, map) {
    //console.log('this.map hit');
  }

  /**
   * Spawn enemy
   * @method: onCollisionPlayerEnemy
   */
  onCollisionPlayerCrate(playerHitArea, map) {
    console.log('crate collide');
  }

  /**
   * Spawn enemy
   * @method: onCollisionBulletCrate
   */
  onCollisionBulletCrate(bullet, crate) {
    console.log('crate hit');

    bullet.kill();
    
    crate.health -= 0.1;

    if(crate.health <= 0)
      this.createDeath(crate);
  }

  /**
   * Spawn enemy
   * @method: onCollisionPlayerEnemy
   */
  onCollisionPlayerEnemy(playerHitArea, enemies) {

    //live = lives.getFirstAlive();

    //if (live)
    //{
      //live.kill();
    //}

    // And create an explosion :)

    // When the player dies
    //if (lives.countLiving() < 1)
    //{
      this.player.view.kill();
      //enemyBullets.callAll('kill');

      //stateText.text=" GAME OVER \n Click to restart";
      //stateText.visible = true;

      //the "click to restart" handler
      //this.game.input.onTap.addOnce(restart, this);
    //}
  }

  /**
   * On update handler
   * @method: onCollisionAttackEnemy
   */
  onCollisionAttackEnemy(playerHitArea, enemy) {
    if(!playerEnemyHits(enemy)) {
      this.player.hitArray.push(enemy);
      this.woundAgent(enemy, 0.2);
    }
  }

  /**
   * On update handler
   * @method: onCollisionPlayerWall
   */
  onCollisionPlayerWall(player, wall) {
  }

  /**
   * -----------------------------------------------------------------------------------------------------------------------------
   * Game listeners
   */

  /**
   * On init handler
   * @method: onInit
   */
  onInit() {
    console.log('onInit');

    // Scale the game x2
    //this.setGameScale(3);

    //this.player = new Player(this.game);

    // Create keys
    //initKeys();
  }

  /**
   * On preload handler
   * @method: onPreload
   */
  onPreload() {
    console.log('onPreload');
    console.log('this:', this);

    // Preload images
    this.load.tilemapTiledJSON("World", TILEMAP);
    this.load.image('tiles', TILES);
    this.load.image('background', BACKGROUND);
    this.load.image('ui', UI);
    this.load.spritesheet('vicar', PLAYERV, {
      frameWidth: 16,
      frameHeight: 48
    });
    this.load.spritesheet('projectile', PROJECTILE, {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('crate_death', CRATE_DEATH, {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('wound', DEATH, {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('crate', CRATE, {
      frameWidth: 16,
      frameHeight: 32
    });
    //this.player.prelaod();
  }

  /**
   * On create handler
   * @method: onCreate
   */
  onCreate() {
    console.log('onCreate');

    //var tileset = this.map.addTilesetImage("tiles", "tiles");
    //this.mapLayer = this.map.createStaticLayer("World1", tileset);

    //this.map = this.add.tilemap("level");
    var map = this.make.tilemap({ key: 'World' });
    console.log('map', map);
    var tileset = map.addTilesetImage('tiles');
    console.log('tileset', tileset);
    
    var mapLayer = map.createDynamicLayer(0, tileset, 0, 0);
    //var mapLayer = map.createStaticLayer(0, tileset, 0, 0);

    console.log('mapLayer', mapLayer);

    //groundLayer = map.createDynamicLayer('Ground Layer', groundTiles, 0, 0);
    //coinLayer = map.createDynamicLayer('Coin Layer', coinTiles, 0, 0);

    //mapLayer.setCollisionByProperty({ collides: true });
    
    //this.matter.world.convertTilemapLayer(mapLayer);

    // This isn't totally accurate, but it'll do for now
    //mapLayer.setCollisionBetween(54, 83);

    mapLayer.setCollisionBetween(3, 18);
    mapLayer.setCollisionBetween(20, 128);
    mapLayer.setCollision(1);

    // If we don't have slopes in our map, we can simply specify what the default colliding tile's
    // slope ID should be. In this case, it would just be the ID for a solid rectangle, 1.
    //this.impact.world.setCollisionMapFromTilemapLayer(layer, { defaultCollidingSlope: 1 });








    // Set game physics
    //this.game.physics.startSystem(Phaser.Physics.ARCADE);
    // this.game.stage.smoothed = false;

    // Create this.map
    //this.map = this.game.add.tilemap('level');
    //this.map.addTilesetImage('tiles', 'tiles');

    var bg = this.add.sprite(0, 0, 'background');
    bg.fixedToCamera = true;

    // Create this.map layer 1
    //this.mapLayer = this.map.createLayer('World1');
    //this.mapLayer.resizeWorld();

    //this.map.setCollisionBetween(3, 18);
    //this.map.setCollisionBetween(20, 128);
    //this.map.setCollision(1);

    // Create player
    //createPlayer();
    this.player.create();

    // Create this.enemies
    this.createEnemies();

    // Create this.enemies
    this.createObjects();

    // Create UI
    this.createUi();

    // Initiate cursor controls
    this.cursors = this.game.input.keyboard.createCursorKeys();
  }

  /**
   * On update handler
   * @method: onUpdate
   */
  onUpdate() {
    //updatePlayer();

    this.player.update();

    // Check player.view / wall collisions
    this.game.physics.arcade.collide(this.player.view, this.mapLayer, this.onCollisionPlayerMap);
    this.game.physics.arcade.collide(this.player.view, this.enemies, this.onCollisionPlayerEnemy);
    this.game.physics.arcade.collide(this.player.view, this.crates, this.onCollisionPlayerCrate);
    this.game.physics.arcade.collide(this.bullets, this.crates, this.onCollisionBulletCrate);
    //this.game.physics.arcade.collide(player.hitArea, this.enemies, onCollisionAttackEnemy);
  }

  /**
   * On render handler
   * 
   * @method: onRender
   * @return: {Void}
   */
  onRender() {
    console.log('onRender');
    if (this.debug) {
      //this.game.debug.bodyInfo(player.view, -40, 20);
      this.game.debug.body(this.player.view, "#ff0000", false);
      //this.game.debug.body(player.hitArea);
      //this.game.debug.body(crate);
      //this.game.debug.body(crate2);
    }
  }

  /**
   * Initiates the game by instantiating Phaser
   * 
   * @method: init
   * @param: {String} elementId
   * @return: {Void}
   */
  init(elementId) {
    console.log('init');
    console.log('Phaser', Phaser);

    var config = {
      type: Phaser.AUTO,
      width: 160,
      height: 144,
      pixelArt: true,
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      },
      scene: {
        init: this.onInit,
        preload: this.onPreload,
        create: function () {
          console.log('create');
          console.log('this:', this);
          this.onCreate();
        },
        update: function () {
          //console.log('update');
          //console.log('this:', this);
          //this.onPreload,
        }
        //,
        //create: this.onCreate,
        //update: this.onUpdate
      }
    };

    this.game = new Phaser.Game(config);

    /*
    this.game = new Phaser.Game(160, 144, Phaser.CANVAS, elementId, {
        init: () => this.onInit(),
        preload: () => this.onPreload(),
        create: () => this.onCreate(),
        update: () => this.onUpdate(),
        render: () => this.onRender()
    }, false, false);
    */
  }
}

const game = new ROBO_CATS();
game.init('game');
    