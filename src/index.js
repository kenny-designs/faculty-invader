// import the game framework phaser
import Phaser from "phaser";

const imageDir = './assets/images/';

// import custom classes
import Player     from './assets/scripts/player.js';
import EnemyGroup from './assets/scripts/enemygroup.js';
import Scoreboard from './assets/scripts/scoreboard.js';
import BulletPool from './assets/scripts/bulletpool.js';

// import image assets
import bulletImg      from './assets/images/bullet.png';
import snakeImg       from './assets/images/snake.png';
import enemyBulletImg from './assets/images/enemy-bullet.png';
import invaderImg     from './assets/images/invader32x32x4.png';
import grossImg       from './assets/images/gross.png';
import kaboomImg      from './assets/images/explode.png';
import starfieldImg   from './assets/images/starfield.png';
import backgroundImg  from './assets/images/background2.png';

// import json files
import snakeJSON      from './assets/images/snake.json';

// create configuration file for our game
const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
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
  this.load.image('gross',         grossImg);
  this.load.image('starfield',     starfieldImg);
  this.load.image('background',    backgroundImg);

  // load spritesheets
  this.load.spritesheet('invader', invaderImg, { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('kaboom',  kaboomImg, { frameWidth: 128, frameHeight: 128 });

  // load texture atlas
  this.load.atlas('snake', snakeImg, snakeJSON);
}

/**
 * Create game assets
 */ 
function create() {
  // get the width and height of the game
  const WIDTH  = this.game.config.width,
        HEIGHT = this.game.config.height;

  // create the background image
  this.background = this.add.tileSprite(400, 300, WIDTH, HEIGHT, 'starfield');

  // create the player
  this.player = new Player(this, 400, 500, 'gross');

  // TODO: find a better place for creating animations
  this.anims.create({
    key: 'fly',
    frames: this.anims.generateFrameNumbers('invader', {start: 0, end: 3}),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'explode',
    frames: this.anims.generateFrameNumbers('kaboom'),
    frameRate: 20,
    repeat: 0
  });

  this.anims.create({
    key: 'snake-anim',
    frames: this.anims.generateFrameNames('snake', {
      start: 0,
      end: 1,
      prefix: 'snake_',
      suffix: '.png'
    }),
    frameRate: 5,
    repeat: -1
  });

  // spawn in the scoreboard
  this.scoreboard = new Scoreboard(this, 0, 0, 'Scoreboard');

  // pool of bullets shared by both the player and the enemies
  this.bulletPool = new BulletPool(this);

  // group of enemies for the player to fight
  this.enemyGroup = new EnemyGroup(this, this.bulletPool);

  // TODO: find a better place for this and implement type checking
  // bullet hits an enemy
  this.physics.add.overlap(this.enemyGroup, this.bulletPool, (enemy, bullet) => {
    if(bullet.firedState === this.bulletPool.fireStates.PLAYER_FIRED) {
      enemy.kill();
      bullet.kill();
      this.scoreboard.increaseScore(100);
      this.enemyGroup.updateCollisionRect();
    }
  });

  // bullet hits the player
  this.physics.add.overlap(this.player, this.bulletPool, (player, bullet) => {
    if(bullet.firedState === this.bulletPool.fireStates.ENEMY_FIRED) {
      player.kill();
      bullet.kill();
    }
  });

  // enemy runs into the player
  this.physics.add.overlap(this.player, this.enemyGroup, (player, enemy) => {
    player.kill();
    enemy.kill();
    this.enemyGroup.updateCollisionRect();
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
  this.background.tilePositionY -= 100 / delta;

  // update the player
  this.player.update(time, delta);

  // update the enemy group
  this.enemyGroup.update(time, delta);

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
    this.player.fireBullet(this.bulletPool);
  }
}
