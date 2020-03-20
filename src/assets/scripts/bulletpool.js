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

    // have collision box match texture
    this.body.syncBounds = true;

    this.name = 'bullet';

    this.firedState;

    this.TOP_BOUND = -this.displayHeight;
    this.BOTTOM_BOUND = scene.game.config.height + this.displayHeight;

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
    if (this.y < this.TOP_BOUND || this.y > this.BOTTOM_BOUND) {
      this.kill();
    }
  }

  /**
   * Removes the bullet from play
   */
  kill() {
    this.disableBody(true, true);
    this.anims.stop();
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

    // create various states for how the bullet was fired
    this.fireStates = Object.freeze({
      'NONE': 1,
      'ENEMY_FIRED': 2,
      'PLAYER_FIRED': 3
    });

    // Add the player to the scene
    scene.add.existing(this);
  }

  /**
   * Fire a bullet from the given position
   * @param xPos X position to fire from
   * @param yPos Y position to fire from
   * @param yVel The velocity to fire the bullet on the Y axis
   * @param state The fire state of the bullet
   * @param texture The texture key to fire the bullet with
   * @param anim The animation key to play when firing
   */ 
  fireBullet(xPos, yPos, yVel, state, texture = 'bullet', anim = null) {
    // grab a bullet from the pool and fire it
    let bullet = this.get();
    if(bullet) {
      // assign a texture/animation to the bullet
      if(texture) bullet.setTexture(texture);
      if(anim)    bullet.anims.play(anim);
    
      // enable and launch the bullet
      bullet.firedState = state;
      bullet.enableBody(true, xPos, yPos, true, true);
      bullet.setVelocityY(yVel);
    }
  }
}

export default BulletPool;
