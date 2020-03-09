import Phaser from 'phaser';

/**
 * @classdesc
 * Scoreboard Class
 */
class Scoreboard extends Phaser.GameObjects.GameObject {
  /**
   * Creates a new scoreboard object
   * @param scene The scene to spawn the scoreboard in
   */ 
  constructor(scene) {
    super(scene, 'scoreboard');

    // the player's current score
    this.score = 0;
    this.scoreText = scene.add.text(scene.game.config.width - 10, 10, this.score, {
      fontSize: 32,
      rtl: true
    });

    // highscore
    // TODO: add functionality to this
    this.highscore = 0;
    this.highscoreText = scene.add.text(10, 10, 'HI ' + this.score, { fontSize: 32 });

    // add the scoreboard to the scene
    scene.add.existing(this);
  }

  /**
   * Increase the player's score by the given number of points
   * @param points The number of points to increase the score by
   */ 
  increaseScore(points) {
    this.score += points;
    this.scoreText.setText(this.score);
  }
}

export default Scoreboard;
