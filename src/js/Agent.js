/**
 * Agent
 */
export default class Agent {
  constructor(game, height, width) {
    this.game = game;
    this.view = null;
    this.strength = 0.4;
    this.health = 1;
    this.speed = 96;
    this.hitArea = null;
    this.hitArray = []
    this.height = height;
    this.width = width;
    this.direction = {
        'x': 1,
        'y': 0
    };
    this.nextFire = 0;
    this.fireRate = 250;

    this.create();
  }
  
  init() {
      
  }
      
  create() {
  }
  
  update() {
  }
  
  wound(val) {
    this.health -= val;
    
    if (this.health <= 0) {
      this.kill();
    }
  }
  
  kill() {
    this.health = 0;
  }
}
