// import the game framework phaser
import Phaser from "phaser";

// import custom classes
import Player     from './assets/scripts/player.js';
import EnemyGroup from './assets/scripts/enemygroup.js';
import Scoreboard from './assets/scripts/scoreboard.js';
import BulletPool from './assets/scripts/bulletpool.js';

// import image assets
import bulletImg      from './assets/images/snake.png';
import enemyBulletImg from './assets/images/f-letter.png';
import grossImg       from './assets/images/gross.png';
import kaboomImg      from './assets/images/explode.png';
import backgroundImg  from './assets/images/classroom.jpg';
import facultyThurm   from './assets/images/thurm.png';

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
    init: init,
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

/**
 * Scene initialization
 */
function init(data) {
  // get the previous score
  this.lastScore = typeof(data.lastScore) != 'undefined' ? data.lastScore : 0;
  this.lastLives = typeof(data.lastLives) != 'undefined' ? data.lastLives : 3;
}

/**
 * Preload images and spritesheets into the game
 */ 
function preload() {
  // load images
  this.load.image('bullet',        bulletImg);
  this.load.image('enemyBullet',   enemyBulletImg);
  this.load.image('gross',         grossImg);
  this.load.image('background',    backgroundImg);
  this.load.image('facultyThurm',  facultyThurm);

  // load spritesheets
  this.load.spritesheet('kaboom',  kaboomImg, { frameWidth: 128, frameHeight: 128 });
}

/**
 * Create game assets
 */ 
function create() {
  // get the width and height of the game
  const WIDTH  = this.game.config.width,
        HEIGHT = this.game.config.height;

  // true if the game is over
  this.isGameOver = false;

  // create the background image
  this.background = this.add.tileSprite(WIDTH / 2, HEIGHT / 2, 0, 0, 'background');

  // create the player
  this.player = new Player(this, WIDTH / 2, HEIGHT - 64, 'gross', this.lastLives);

  this.anims.create({
    key: 'explode',
    frames: this.anims.generateFrameNumbers('kaboom'),
    frameRate: 20,
    repeat: 0
  });

  // spawn in the scoreboard
  this.scoreboard = new Scoreboard(this, this.lastScore);

  // pool of bullets shared by both the player and the enemies
  this.bulletPool = new BulletPool(this);

  // group of enemies for the player to fight
  this.enemyGroup = new EnemyGroup(this, this.bulletPool);

  // bullet hits an enemy
  this.physics.add.overlap(this.enemyGroup, this.bulletPool, (enemy, bullet) => {
    if(bullet.firedState === this.bulletPool.fireStates.PLAYER_FIRED) {
      enemy.kill();
      bullet.kill();
      this.scoreboard.increaseScore(100);

      // check if any enemies remain
      if (this.enemyGroup.livingEnemies.length === 0) {
        this.scene.restart({
          lastScore: this.scoreboard.score,
          lastLives: this.player.lives
        });
      }
      this.enemyGroup.updateCollisionRect();
    }
  });

  // bullet hits the player
  this.physics.add.overlap(this.player, this.bulletPool, (player, bullet) => {
    if(bullet.firedState === this.bulletPool.fireStates.ENEMY_FIRED) {
      player.kill();
      bullet.kill();

      // check if the player is dead
      if (!player.isAlive) {
        this.isGameOver = true;
      }
    }
  });

  // enemy runs into the player
  this.physics.add.overlap(this.player, this.enemyGroup, (player, enemy) => {
    player.kill();
    enemy.kill();
    this.enemyGroup.updateCollisionRect();
  });

  // restart game text
  this.restartText = this.add.text(WIDTH / 2 - 200, 70, 'Play Again?', {
    fontSize: 64,
    color: '#CA0903',
    backgroundColor: '#FFFDD4'
  });
   
  // make restart game text interactive
  this.restartText.setInteractive();
  this.restartText.on('pointerdown', pointer => this.scene.restart());
  this.restartText.on('pointerover', pointer => this.restartText.setColor('orange'));
  this.restartText.on('pointerout',  pointer => this.restartText.setColor('#CA0903'));

  // restart text invisible by default
  this.restartText.setVisible(false);

  // set up keyboard input
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
  // do nothing if the game is over
  if (this.isGameOver) {
    this.restartText.setVisible(true);
    this.player.moveStop();
    this.enemyGroup.setVelocityX(0);
    return;
  }

  // update the player
  this.player.update(time, delta);

  // update the enemy group
  this.enemyGroup.update(time, delta);

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
