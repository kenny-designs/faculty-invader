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

    scene.physics.world.enableBody(this, 0);

    this.setActive(false);
    this.setVisible(false);

    scene.add.existing(this);
  }

  /**
   * Fire Bullet
   */
  fireBullet(xPos, yPos, yVel) {
    this.setPosition(xPos, yPos);
    this.setVelocityY(yVel);

    this.setActive(true);
    this.setVisible(true);
  }
}

export default Bullet;
