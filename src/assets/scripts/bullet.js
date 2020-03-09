import Phaser from 'phaser';

/**
 * @classdesc
 * Bullet class
 */
class Bullet extends Phaser.Physics.Arcade.Sprite {
  /**
   * Creates a new Bullet object
   */ 
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    // enable physics on the bullet
    scene.physics.world.enableBody(this, 0);

    // disable the bullet by default
    this.disable();

    // add the bullet to the scene
    scene.add.existing(this);
  }

  /**
   * Update
   * @override
   */ 
  update(time, delta) {
    this.checkBounds();
  }

  /**
   * Checks to see if the bullet is on the screen. Remove if it is not.
   */
  checkBounds() {
    if (this.y < -this.displayHeight) {
      this.disable();
    }
  }

  /**
   * Fire Bullet
   * @param xPos X position to fire from
   * @param yPos Y position to fire from
   * @param yVel velocity to fire the bullet on the Y axis
   */
  fireBullet(xPos, yPos, yVel) {
    this.enableBody(true, xPos, yPos, true, true);
    this.setVelocityY(yVel);
  }

  /**
   * Removes the bullet from play
   */
  kill() {
    this.disable();
  }

  /**
   * Disables the bullet's body so that it is no longer affected by the
   * physics engine.
   */ 
  disable() {
    this.disableBody(true, true);
  }
}

export default Bullet;
