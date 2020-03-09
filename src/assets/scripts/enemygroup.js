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
      this.disableBody(true, true);
    });
  }
}

/**
 * @classdesc
 * EnemyGroup class. Manages all enemies within the scene.
 */
class EnemyGroup extends Phaser.Physics.Arcade.Group {
  /**
   * Creates a new EnemyGroup object
   * @param scene The scene the group belongs to
   * @param bulletPool Pool of bullets for the enemies to shoot from
   */ 
  constructor(scene, bulletPool) {
    super(scene.physics.world, scene, {
      classType: Enemy,
      key: 'invader',
      quantity: 55,
      gridAlign: {
        width: 11,
        height: 5,
        cellWidth: 64,
        cellHeight: 64,
        x: 64,
        y: 64
      }
    });

    // bullet pool reference
    this.bulletPool = bulletPool;

    this.lastFire = 0;

    // Add the player to the scene
    scene.add.existing(this);
  }

  /**
   * Fires a bullet from a random enemy
   * @param delta Time since last update
   */ 
  fireRandomEnemy(delta) {
    this.lastFire += delta;

    if(this.lastFire > 1000) {
      let children = this.getChildren().filter(child => child.isAlive);;
      let enemy = Phaser.Math.RND.pick(children);
      this.bulletPool.fireBullet(enemy.x, enemy.y, 1000);
      this.lastFire = 0;
    }
  }
}

export default EnemyGroup;
