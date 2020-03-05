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

    // prevent movement from collisions (such as from bullets)
    this.setImmovable(true);

    // Add the player to the scene
    scene.add.existing(this);
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
}

export default Player;
