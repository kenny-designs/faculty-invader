import Phaser from 'phaser';
import Bullet from './bullet.js';

/**
 * @classdesc
 * BulletPool class. Manages firing bullets throughout the game.
 */
class BulletPool extends Phaser.Physics.Arcade.Group {
  /**
   * Creates a new player object
   * @param world The physics simulation
   * @param scene The scene the group belongs to
   * @param children Game Object to add to this group; or the config argument
   * @param config Settings for this group
   */ 
  constructor(world, scene, children, config) {
    super(world, scene, children, config);

    // Add the player to the scene
    scene.add.existing(this);
  }

  /**
   * Fire a bullet from the player's position
   */ 
  fireBullet(xPos, yPos, yVel) {
    // grab a bullet from the pool and fire it
    let bullet = this.get();
    if(bullet) {
      bullet.fireBullet(xPos, yPos, yVel);
      this.lastFire = 0;
    }
  }
}

export default BulletPool;
