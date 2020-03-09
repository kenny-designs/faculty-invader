import Phaser from 'phaser';

/**
 * @classdesc
 * Bullet class used by BulletPool.
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
    this.disableBody(true, true);

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
      this.kill();
    }
  }

  /**
   * Removes the bullet from play
   */
  kill() {
    this.disableBody(true, true);
  }
}


/**
 * @classdesc
 * BulletPool class. Manages firing bullets throughout the game.
 */
class BulletPool extends Phaser.Physics.Arcade.Group {
  /**
   * Creates a new BulletPool object
   * @param scene The scene the group belongs to
   */ 
  constructor(scene) {
    super(scene.physics.world, scene, {
      classType: Bullet,
      defaultKey: 'bullet',
      maxSize: 30,
      runChildUpdate: true
    });

    // Add the player to the scene
    scene.add.existing(this);
  }

  /**
   * Fire a bullet from the given position
   * @param xPos X position to fire from
   * @param yPos Y position to fire from
   * @param yVel velocity to fire the bullet on the Y axis
   */ 
  fireBullet(xPos, yPos, yVel) {
    // grab a bullet from the pool and fire it
    let bullet = this.get();
    if(bullet) {
      bullet.enableBody(true, xPos, yPos, true, true);
      bullet.setVelocityY(yVel);
    }
  }
}

export default BulletPool;
