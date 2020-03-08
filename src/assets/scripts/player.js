import Phaser from 'phaser';
import Bullet from './bullet.js';

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

    // prevent movement from collisions (such as from bullets)
    this.setImmovable(true);

    // setup bullet pool
    this.bullets = scene.add.group({
      classType: Bullet,
      defaultKey: 'bullet',
      maxSize: 30,
      runChildUpdate: true
    });

    // time since last fire in milliseconds
    this.lastFire = 0;

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
   * Fire
   */ 
  fireBullet() {
    if (this.lastFire < 100) return;

    let bullet = this.bullets.get();
    if(bullet) {
      bullet.fireBullet(this.x, this.y, -1000);
      this.lastFire = 0;
    }
  }
}

export default Player;
