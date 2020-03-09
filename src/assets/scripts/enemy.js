import Phaser from 'phaser';

/**
 * @classdesc
 * Enemy Class
 */
class Enemy extends Phaser.Physics.Arcade.Sprite {
  /**
   * Creates a new enemy object
   * @param scene The scene to spawn the player in
   * @param x The x position to spawn the player in
   * @param y The y position to spawn the player in
   * @param texture Texture key for the ship's sprite
   */ 
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    // setup animations
    this.anims.play('fly');

    // enemy is initially alive
    this.isAlive = true;

    // enable physics
    scene.physics.world.enableBody(this, 0);
    this.setCollideWorldBounds(true);

    // prevent movement from collisions (such as from bullets)
    this.setImmovable(true);

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
      this.disable();
    });
  }

  /**
   * Disables the enemy's body so that it is no longer affected by the
   * physics engine.
   */ 
  disable() {
    this.disableBody(true, true);
  }
}

export default Enemy;
