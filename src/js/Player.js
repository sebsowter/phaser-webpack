import Agent from './Agent';

/**
 * Player
 */
export default class Player extends Agent {
  constructor(game) {
    super(game);

    this.game = game;
    this.view = null;
    this.strength = 0.4;
    this.speed = 96;
    this.bullets = null
    this.hitArea = null;
    this.hitArray = []
    this.height = 64;
    this.width = 32;
    this.isAttacking = false,
    this.isBuilding = false,
    this.direction = {
        'x': 1,
        'y': 0
    };
    this.keys = {
        'space': null
    };

    this.initKeys();
  }
    
  preload() {
    this.game.load.spritesheet('vicar', 'images/vicar.gif', 16, 32);
  }
    
  create() {
    // Create hitArea
    //this.hitArea = game.add.sprite();
    //this.hitArea.anchor.setTo(0, 0);
    //game.physics.enable(this.hitArea);
    //this.hitArea.body.setSize(16, 16);

    // Create view
    this.view = this.game.add.sprite(10 * 16, 22 * 16, 'vicar');
    this.view.anchor.setTo(0.5, 0.75);
    this.view.enableBody = true;
    this.game.physics.enable(this.view);

    this.view.body.setSize(12, 12, 2, 18);
    this.view.body.collideWorldBounds = true;
    this.game.camera.follow(this.view);

    // Create animations
    // this.view.animations.add('downStanding', [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1], 6, true);
    this.view.animations.add('downStanding', [0], 0, true);
    this.view.animations.add('downWalk', [0, 0], 4, true);
    this.view.animations.add('downBuild', [0, 0], 12, false);
    this.view.animations.add('downSwipe', [10, 11, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13], 12, false);
    //this.view.animations.add('upStanding', [5, 5], 6, true);
    this.view.animations.add('upStanding', [0], 0, true);
    this.view.animations.add('upWalk', [0, 0], 4, true);
    this.view.animations.add('upSwipe', [18, 19, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21], 12, false);
    this.view.animations.add('upBuild', [17, 17], 12, false);


    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

    this.bullets.createMultiple(1000, 'projectile');
    //bullets.animations.add('vShoot', [3, 2], 12, false);
    //bullets.animations.add('hShoot', [1, 0], 12, false);
    // bullets.animations.add('dShoot', [5, 4], 12, false);
    //bullets.setAll('checkWorldBounds', true);
    //bullets.setAll('outOfBoundsKill', true);
        this.cursors = this.game.input.keyboard.createCursorKeys();
  }
  
  initKeys() {

      // Set this.keys
      this.keys.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  }
  
  createDeath() {
    
  }
  
  update() {
    // Vars
    var speed = this.speed,
    animation = 'downWalk',
    direction = {
        'x': 0,
        'y': 0
    };

    // Cursor controls
    direction.x = this.cursors.left.isDown ? -1 : this.cursors.right.isDown ? 1 : 0;
    direction.y = this.cursors.up.isDown ? -1 : this.cursors.down.isDown ? 1 : 0;

    // Keep track of last direction ensuring x is not zero
    this.direction.x = direction.x === 0 ? this.direction.x : direction.x;
    this.direction.y = direction.x === 0 && direction.y === 0 ? this.direction.y : direction.y;

    if (this.keys.space.isDown) {

      // Reduce speed if attacking
      speed /= 2;

      //if(this.keys.space.isDown)
          this.playerAttack(this.direction);

  // } else if(this.keys.space.isDown) {

      // Attack
      //playerBuild(this.direction);

      // Reduce speed if attacking
      // speed /= 2;

    } else {

      // Play animation
      this.view.animations.play(direction.x === 0 && direction.y === 0 ? this.direction.y < 0 ? 'upStanding' : 'downStanding' : direction.y < 0 ? 'upWalk' : 'downWalk');

      // Flip if facing left
      this.view.scale.x = this.direction.x < 0 ? -1 : 1;
    }

    // Move this.view
    this.view.body.velocity.x = direction.x * speed;
    this.view.body.velocity.y = direction.y * speed;
  }

  /**
   * Gets whether the this.view has already hit enemy
   * @method: playerEnemyHits
   * @params: {enemy}
   * @return: boolean
   */
  playerEnemyHits(enemy) {
    for(var i = 0; i < this.hitArray.length; i++) {
      if(this.hitArray[i] === enemy)
        return true;
    }

    return false;
  }

  /**
   * Create enemies
   * @method: playerBuild
   */
  playerBuild(direction) {

    // Prevent further attacks
    this.isAttacking = true;
    this.isBuilding = true;

    // Reset enemies
    this.hitArray = [];

    // Play animation
    this.view.animations.play(direction.y < 0 ? 'upBuild' : 'downBuild');
  }

  /**
   * Create enemies
   * @method: playerAttack
   */
  playerAttack(direction) {

    // Prevent further attacks
    this.isBuilding = false;
    this.isAttacking = true;

    // Keep track of last direction ensuring x is not zero
    //bulletDirection.x = direction.x === 0 ? this.direction.x : direction.x;
    //bulletDirection.y = direction.x === 0 && direction.y === 0 ? this.direction.y : direction.y;

    this.fire(direction);

    // Play animation
    //this.view.animations.play(direction.y < 0 ? 'upSwipe' : 'downSwipe', 12, false, false);

    //this.hitArea.scale.x = direction.x;

    // Add this.hitArea
    //this.view.addChild(this.hitArea);
    /*
    // Add hit area
    game.time.events.add(Phaser.Timer.SECOND * 1, function() {

        // Reset attack
        isAttacking = false;

        // Remove this.hitArea
        this.view.removeChild(this.hitArea);

        this.hitArea.body.x = 0;
        this.hitArea.body.y = 0;

    }, this);
    */
  }

  fire(direction) {

    if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
      this.nextFire = this.game.time.now + this.fireRate;

      var bullet = this.bullets.getFirstDead();

      bullet.reset(this.view.x, this.view.y - 8);
      //bullet.animations.add('downStanding', [0], 0, true);

      if(direction.x !== 0 && direction.y !== 0) {
        this.bullets.callAll('animations.add', 'animations', 'projectile1', [5, 4], 12, false);
        this.bullets.callAll('play', null, 'projectile1');
      }
      else if(direction.x !== 0) {
        this.bullets.callAll('animations.add', 'animations', 'projectile2', [1, 0], 12, false);
        this.bullets.callAll('play', null, 'projectile2');
      }
      else if(direction.y !== 0) {
        this.bullets.callAll('animations.add', 'animations', 'projectile3', [3, 2], 12, false);
        this.bullets.callAll('play', null, 'projectile3');
      }

      // bullets.animations.currentAnim.setFrame(0);


      //game.physics.arcade.moveToPointer(bullet, 300);
      bullet.body.velocity.y = direction.y * 200;
      //bullet.body.rotate = 90 * (Math.PI / 180);
      bullet.body.velocity.x = direction.x * 200;
      bullet.scale.x = direction.x < 0 ? -1 : 1;
      bullet.scale.y = direction.y < 0 ? -1 : 1;
    }
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
        this.view.kill();
        //enemyBullets.callAll('kill');

        //stateText.text=" GAME OVER \n Click to restart";
        //stateText.visible = true;

        //the "click to restart" handler
        //game.input.onTap.addOnce(restart, this);
    //}
  }

  /**
   * On update handler
   * @method: onCollisionAttackEnemy
   */
  onCollisionAttackEnemy(playerHitArea, enemy) {

    if(!playerEnemyHits(enemy)) {

      this.hitArray.push(enemy);

      this.woundAgent(enemy, 0.2);
    }
  }

  /**
   * Wounds an enemy
   * @method: woundAgent
   * @params: {enemy}
   */
  woundAgent(agent, damage) {

      // Calc x and y
      var x = agent.body.x + (agent.body.width / 2),
          y = agent.body.y + (agent.body.height / 2);
      
      // Reduce health by damage
      agent.health -= damage;
      
      // Set animation type
      var animation = agent.health <= 0 ? 'death' : 'wound';

      // Add animation
      death = this.game.add.sprite(x, y, animation);
      death.anchor.setTo(0.5, 0.5);

      if(animation === 'death')
          death.animations.add(animation, [0, 1, 2, 3, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 7], 12, false, true);
      else 
          death.animations.add(animation, [8, 9, 10, 11], 12, false, true);

      death.animations.play(animation, 12, false, false);

      // Kill agent if health below zero
      if(agent.health <= 0)
          agent.kill();
  }
  
  onInit() {

    // Create this.keys
    initthis.keys();
  }
}
