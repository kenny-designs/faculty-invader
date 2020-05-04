import Phaser from 'phaser';

/**
 * @classdesc
 * Scoreboard Class
 */
class Scoreboard extends Phaser.GameObjects.GameObject {
  /**
   * Creates a new scoreboard object
   * @param scene The scene to spawn the scoreboard in
   * @param score to start with
   */ 
  constructor(scene, score = 0) {
    super(scene, 'scoreboard');

    // the player's current score
    this.score = score;
    this.scoreText = scene.add.text(25, 13, 'SCORE ' + this.score, {
      fontSize: 32,
      color: '#CA0903'
    });

    // add the scoreboard to the scene
    scene.add.existing(this);
  }

  /**
   * Increase the player's score by the given number of points
   * @param points The number of points to increase the score by
   */ 
  increaseScore(points) {
    this.score += points;
    this.scoreText.setText('SCORE ' + this.score);
  }
}

export default Scoreboard;
