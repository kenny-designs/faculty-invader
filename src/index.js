// import the game framework phaser
import Phaser from "phaser";

// import custom classes
import Player from './assets/scripts/player.js';
import Enemy  from './assets/scripts/enemy.js';

// import image assets
import bulletImg      from './assets/images/bullet.png';
import enemyBulletImg from './assets/images/enemy-bullet.png';
import invaderImg     from './assets/images/invader32x32x4.png';
import shipImg        from './assets/images/player.png';
import kaboomImg      from './assets/images/explode.png';
import starfieldImg   from './assets/images/starfield.png';
import backgroundImg  from './assets/images/background2.png';

// create configuration file for our game
const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug:true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

/**
 * Preload images and spritesheets into the game
 */ 
function preload() {
  // load images
  this.load.image('bullet',        bulletImg);
  this.load.image('enemyBullet',   enemyBulletImg);
  this.load.image('ship',          shipImg);
  this.load.image('starfield',     starfieldImg);
  this.load.image('background',    backgroundImg);

  // load spritesheets
  this.load.spritesheet('invader', invaderImg, { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('kaboom',  kaboomImg, { frameWidth: 128, frameHeight: 128 });
}

/**
 * Create game assets
 */ 
function create() {
  // create the background image
  // TODO: fix hardcoded values
  this.background = this.add.tileSprite(400, 300, 800, 600, 'starfield');

  // create the player
  this.player = new Player(this, 400, 500, 'ship');

  // TODO: find a better place for this
  this.anims.create({
    key: 'fly',
    frames: this.anims.generateFrameNumbers('invader', {start: 0, end: 3}),
    frameRate: 20,
    repeat: -1
  });

  this.anims.create({
    key: 'explode',
    frames: this.anims.generateFrameNumbers('kaboom'),
    frameRate: 20,
    repeat: 0
  });

  // TODO: place inside a group
  // create a sample enemy
  this.enemy = new Enemy(this, 400, 100, 'invader');

  // TODO: find a better place for this
  // setup collisions
  this.physics.add.overlap(this.player.bullets, this.enemy, (object1, object2) => {
    this.enemy.kill();
  });

  // set up keyboard input
  // TODO: Create a input controller class to handle all this
  this.cursors = this.input.keyboard.addKeys({
    'left': Phaser.Input.Keyboard.KeyCodes.A,
    'right': Phaser.Input.Keyboard.KeyCodes.D,
    'fire': Phaser.Input.Keyboard.KeyCodes.SPACE
  });
}

/**
 * Gameplay loop
 */ 
function update(time, delta) {
  //  Scroll the background
  //  TODO: see if parallax with ship
  this.background.tilePositionY -= 100 / delta;

  // update the player
  this.player.update(time, delta);

  // TODO: refactor into its own function
  // control player movement
  if(this.cursors.left.isDown) {
    this.player.moveLeft(300);
  }
  else if(this.cursors.right.isDown) {
    this.player.moveRight(300);
  }
  else {
    this.player.moveStop();
  }

  // Fire
  if(this.cursors.fire.isDown) {
    this.player.fireBullet();
  }
}
