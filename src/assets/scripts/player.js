import Phaser from 'phaser';

/**
 * @classdesc
 * Player class
 */
class Player extends Phaser.Physics.Arcade.Sprite {
  /**
   * Creates a new player object
   * @param scene The scene to spawn the player in
   * @param x The x position to spawn the player in
   * @param y The y position to spawn the player in
   * @param texture Texture key for the ship's sprite
   */ 
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    // Enable physics
    scene.physics.world.enableBody(this, 0);
    this.setCollideWorldBounds(true);

    // Set size
    this.setDisplaySize(32, 64);

    // prevent movement from collisions (such as from bullets)
    this.setImmovable(true);

    // setup firing properties
    this.lastFire      = 0;     // delta time since last fire
    this.FIRE_RATE     = 500;   // how often in milliseconds to fire
    this.FIRE_VELOCITY = -1000; // velocity for the bullet to move at

    this.name = 'player';

    // number of lives left for the player
    this.lives = 3;
    this.livesText = scene.add.text(scene.game.config.width / 2, 10, 'Lives: ' + this.lives, {
      fontSize: 32
    });

    // Add the player to the scene
    scene.add.existing(this);
  }

  /**
   * @override
   */
  update(time, delta) {
    // update time since last fire
    this.lastFire += delta;
  }

  /**
   * Move the player to the left at the given velocity
   * @param xVel x velocity to move the player
   */ 
  moveLeft(xVel) {
    this.setVelocityX(-xVel);
  }

  /**
   * Move the player to the right at the given velocity
   * @param xVel x velocity to move the player
   */ 
  moveRight(xVel) {
    this.setVelocityX(xVel);
  }

  /**
   * Stop player movement
   */ 
  moveStop() {
    this.setVelocityX(0);
  }

  /**
   * Fire a bullet from the player's position
   * @param bulletPool Pool of bullets to fire from
   */ 
  fireBullet(bulletPool) {
    // prevent player from firing too often
    if (this.lastFire < this.FIRE_RATE) return;

    bulletPool.fireBullet(this.x,
                          this.y,
                          this.FIRE_VELOCITY,
                          bulletPool.fireStates.PLAYER_FIRED,
                          'bullet');
    this.lastFire = 0;
  }

  /**
   * Kills the player
   */
  kill() {
    this.livesText.setText('Lives: ' + --this.lives);
    if(this.lives <= 0) {
      //alert('YOU DIED!');
    }
  }
}

export default Player;
