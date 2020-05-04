import Phaser from 'phaser';

/**
 * @classdesc
 * Enemy Class
 */
class Enemy extends Phaser.Physics.Arcade.Sprite {
  /**
   * Creates a new enemy object
   * @param scene The scene to spawn the enemy in
   * @param x The x position to spawn the enemy in
   * @param y The y position to spawn the enemy in
   * @param texture Texture key for the enemy sprite
   */ 
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    // Enable physics
    scene.physics.world.enableBody(this, 0);

    // enemy is initially alive
    this.isAlive = true;

    this.name = 'enemy';

    // add the enemy to the scene
    scene.add.existing(this);
  }

  /**
   * Kills the enemy and plays an explosion in its place.
   */
  kill() {
    if(!this.isAlive) return;

    this.isAlive = false;
    this.anims.play('explode');
    this.on('animationcomplete', () => {
      this.disableBody(true, true);
    });
  }
}

/**
 * @classdesc
 * EnemyGroup class. Manages all enemies within the scene.
 */
class EnemyGroup extends Phaser.Physics.Arcade.Group {
  /**
   * Creates a new EnemyGroup object
   * @param scene The scene the group belongs to
   * @param bulletPool Pool of bullets for the enemies to shoot from
   */ 
  constructor(scene, bulletPool) {
    super(scene.physics.world, scene, {
      classType: Enemy,
      key: ['facultyThurm', 'facultySokol', 'facultyLangsam', 'facultyArnow', 'facultyCox'],
      quantity: 11,
      gridAlign: {
        width: 11,
        height: 5,
        cellWidth: 64,
        cellHeight: 64,
        x: 64,
        y: 128
      }
    });

    // bullet pool reference
    this.bulletPool = bulletPool;

    // setup firing properties
    this.lastFire      = 0;    // delta time since last fire
    this.FIRE_RATE     = 1000; // how often in milliseconds to fire
    this.FIRE_VELOCITY = 1000; // velocity for the bullet to move at

    // setup group movement properties
    this.curVelocity = 10;

    // keep a rectangle representing the width of the group at all times
    this.collisionRect = new Phaser.GameObjects.Rectangle(scene, 0, 0);
    this.collisionRect.setOrigin(0); // set origin to top left corner of rect
    this.add(this.collisionRect, true);
    this.updateCollisionRect();
    
    // make it so collisionRect only checks for collisions with the world bounds
    this.collisionRect.body.collideWorldBounds  = true;
    this.collisionRect.body.onWorldBounds       = true;
    this.collisionRect.body.checkCollision.none = true;

    // handle worldbounds events from collisionRect hitting world bounds
    scene.physics.world.on('worldbounds', (body) => {
      // reverse group direction
      this.setVelocityX((this.curVelocity *= -1));

      // lower group by a level
      this.incY(32);

      // faculty hit the floor, game over!
      if(body.onFloor()) {
        scene.isGameOver = true;
        scene.restartText.setVisible(true);
      }
    });

    // begin group movement
    this.setVelocityX(this.curVelocity);

    // Add the group to the scene
    scene.add.existing(this);
  }

  /**
   * Updates the enemy group
   */
  update(time, delta) {
    this.lastFire += delta;
    this.fireRandomEnemy();
  }

  /**
   * Fires a bullet from a random enemy
   */ 
  fireRandomEnemy() {
    // return if not enough time has passed since the last time we fired
    if(this.lastFire < this.FIRE_RATE) return;

    // return if no living enemies remain
    let living = this.livingEnemies;
    if(living.length < 1) return;

    // get a random living child
    let enemy = Phaser.Utils.Array.GetRandom(living);

    // return if we have no enemies left
    if(typeof enemy === 'undefined') return;

    // fire the bullet and reset lastFire
    this.bulletPool.fireBullet(enemy.x,
                               enemy.y,
                               this.FIRE_VELOCITY,
                               this.bulletPool.fireStates.ENEMY_FIRED,
                               'enemyBullet');

    // reset time since enemies last fired
    this.lastFire = 0;
  }

  /**
   * Updates the rectangle with a new x, y, and width to match the invaders
   */
  updateCollisionRect() {
    let enemies = this.livingEnemies;
    if(enemies.length < 1) return;

    let lowX  = Number.MAX_SAFE_INTEGER,
        highX = Number.MIN_SAFE_INTEGER,
        highY = Number.MIN_SAFE_INTEGER,
        lowY  = Number.MAX_SAFE_INTEGER;

    Phaser.Utils.Array.Each(enemies, (enemy) => {
      // offset from enemies center
      let xoffset = enemy.width / 2,
          yoffset = enemy.height / 2;

      if(enemy.x - xoffset < lowX) {
        lowX = enemy.x - xoffset;
      }

      if(enemy.x + enemy.width - xoffset > highX) {
        highX = enemy.x + enemy.width - xoffset;
      }

      if(enemy.y + enemy.height - yoffset > highY) {
        highY = enemy.y + enemy.height - yoffset;
      }

      if(enemy.y - yoffset < lowY) {
        lowY = enemy.y - yoffset;
      }
    });

    // set the rectangle to a new width and x position to match the group
    this.collisionRect.setSize(highX - lowX, highY - lowY);
    this.collisionRect.body.setSize(highX - lowX, highY - lowY);
    this.collisionRect.setPosition(lowX, lowY);
  }

  /**
   * Returns all enemies who are still alive
   */ 
  get livingEnemies() {
    return this.getChildren().filter(child => child.isAlive);;
  }
}

export default EnemyGroup;
