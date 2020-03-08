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

    // disable by default
    this.setActive(false);
    this.setVisible(false);

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
      this.setActive(false);
      this.setVisible(false);
    }
  }

  /**
   * Fire Bullet
   * @param xPos X position to fire from
   * @param yPos Y position to fire from
   * @param yVel velocity to fire the bullet on the Y axis
   */
  fireBullet(xPos, yPos, yVel) {
    this.setPosition(xPos, yPos);
    this.setVelocityY(yVel);

    // set bullet to be active
    this.setActive(true);
    this.setVisible(true);
  }
}

export default Bullet;
