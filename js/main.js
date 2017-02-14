//this game will have only 1 state
var GameState = {
  //load the game assets before the game starts
  preload: function() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('chicken', 'assets/images/chicken.png');
    this.load.image('horse', 'assets/images/horse.png');
    this.load.image('pig', 'assets/images/pig.png');
    this.load.image('sheep', 'assets/images/sheep3.png');

  },

  //executed after everything is loaded
  create: function() {

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignVertically = true;
    this.scale.pageAlignHorizontally = true;

    // Creat a sprite for the background
    this.background = this.game.add.sprite(0, 0, 'background');
    // Add a chicken to the center of the world
    this.chicken = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY,'chicken');
    // Place the sprite by it center, not the top-left corner
    this.chicken.anchor.setTo(0.5);
    this.chicken.scale.setTo(2, 1);

    this.horse = this.game.add.sprite(120, 10, 'horse');
    this.horse.scale.setTo(0.5);

    this.pig = this.game.add.sprite(500, 300, 'pig');
    this.pig.anchor.setTo(0.5);
    // Flip on x-axis
    this.pig.scale.setTo(-1, 1);

    this.sheep = this.game.add.sprite(100, 250, 'sheep');
    this.sheep.scale.setTo(0.5);
    this.sheep.anchor.setTo(0.5);
    this.sheep.angle = 90;

  },

  //this is executed multiple times per second
  update: function() {
    //this.sheep.angle += 0.5;
  },
  

};

//initiate the Phaser framework
var game = new Phaser.Game(640, 360, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');