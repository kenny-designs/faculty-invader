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
   * @param number of lives
   */ 
  constructor(scene, x, y, texture, lives = 3) {
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
    this.FIRE_RATE     = 100;   // how often in milliseconds to fire
    this.FIRE_VELOCITY = -1000; // velocity for the bullet to move at

    this.name = 'player';

    // number of lives left for the player
    this.lives = lives;
    this.livesText = scene.add.text(scene.game.config.width - 25, 13, 'Lives:' + this.lives, {
      fontSize: 32,
      rtl: true,
      color: '#CA0903'
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
    // face sprite to the left
    if (!this.flipX) this.setFlipX(true);

    this.setVelocityX(-xVel);
  }

  /**
   * Move the player to the right at the given velocity
   * @param xVel x velocity to move the player
   */ 
  moveRight(xVel) {
    // face sprite to the right
    if (this.flipX) this.setFlipX(false);

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

    // fire the bullet
    bulletPool.fireBullet(this.x,
                          this.y,
                          this.FIRE_VELOCITY,
                          bulletPool.fireStates.PLAYER_FIRED,
                          'bullet');

    // reset firing timer
    this.lastFire = 0;
  }

  /**
   * Kills the player
   */
  kill() {
    --this.lives;
    if (this.lives < 0) this.lives = 0;
    this.livesText.setText('Lives: ' + this.lives);
  }

  /**
   * Check if the player is alive.
   * @return True if the player is still alive. False otherwise.
   */
  get isAlive() {
    return this.lives > 0;
  }
}

export default Player;
