//this game will have only 1 state
var GameState = {
  //load the game assets before the game starts
  preload: function() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('arrow', 'assets/images/arrow.png');
    //specify width, height, and number of frames.
    this.load.spritesheet('chicken', 'assets/images/chicken_spritesheet.png', 131, 200, 3);
    this.load.spritesheet('horse', 'assets/images/horse_spritesheet.png', 212, 200, 3);
    this.load.spritesheet('pig', 'assets/images/pig_spritesheet.png', 297, 200, 3);
    this.load.spritesheet('sheep', 'assets/images/sheep_spritesheet.png', 244, 200, 3);
    //audio files for each sprite
    this.load.audio('chickenSound', ['assets/audio/chicken.ogg', 'assets/audio/chicken.mp3']);
    this.load.audio('horseSound', ['assets/audio/horse.ogg', 'assets/audio/horse.mp3']);
    this.load.audio('pigSound', ['assets/audio/pig.ogg', 'assets/audio/pig.mp3']);
    this.load.audio('sheepSound', ['assets/audio/sheep.ogg', 'assets/audio/sheep.mp3']);
  },

  //executed after everything is loaded
  create: function() {

    //scaling optiona
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //have the game centered 
    this.scale.pageAlignVertically = true;
    this.scale.pageAlignHorizontally = true;

    // Create a sprite for the background
    this.background = this.game.add.sprite(0, 0, 'background');

    var animalData = [
      {key: 'chicken', text: 'CHICKEN', audio: 'chickenSound'},
      {key: 'horse', text: 'HORSE', audio: 'horseSound'},
      {key: 'pig', text: 'PIG', audio: 'pigSound'},
      {key: 'sheep', text: 'SHEEP', audio: 'sheepSound'}
    ];

    //create a group to store all animals
    this.animals = this.game.add.group();

    //cant access 'this' in forEach loop.
    var self = this;
    var animal;
    
    //* maybe use this to make dyanamic backgrounds for game. *//
    animalData.forEach(function(element){
      //create each animal and put it in the group
      animal = self.animals.create(-1000, self.game.world.centerY, element.key, 0);

      //save everything that's not phaser-related in a custom property
      animal.customParams = {text: element.key, sound: self.game.add.audio(element.audio)};
      animal.anchor.setTo(0.5);

      //create animal animation
      //it will go from frame 0 - 1 - 2 - 1 etc. played @ 3 frames a second, and it will not loop.
      animal.animations.add('animate', [0,1,2,1,0,1], 3, false);

      //enable input so we can touch it
      animal.inputEnabled = true;
      animal.input.pixelPerfectClick = true; 

      //with pixelPerfectClick on user will only be able to click on the animal, 
      //not the area around it. There is a cost in memory for this.
      animal.events.onInputDown.add(self.animateAnimal, self);
    });
    
//************************************************************************************//

    //place first animal in the middle
    this.currentAnimal = this.animals.next();
    this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY);

    //show animal text
    this.showText(this.currentAnimal);

    // Right Arrow
    this.rightArrow = this.game.add.sprite(580, this.game.world.centerY, 'arrow');
    this.rightArrow.anchor.setTo(0.5);
    this.rightArrow.customParams = {direction: 1};

    // Right arrow allow user inputs
    this.rightArrow.inputEnabled = true;
    this.rightArrow.input.pixelPerfectClick = true;
    this.rightArrow.events.onInputDown.add(this.switchAnimal, this);

    // Left Arrow
    this.leftArrow = this.game.add.sprite(60, this.game.world.centerY, 'arrow');
    this.leftArrow.anchor.setTo(0.5);
    this.leftArrow.scale.x = -1;
    this.leftArrow.customParams = {direction: -1};

    // Left arrow allow user inputs
    this.leftArrow.inputEnabled = true;
    this.leftArrow.input.pixelPerfectClick = true;
    this.leftArrow.events.onInputDown.add(this.switchAnimal, this);
  },

//************************************************************************************//

  //this is executed multiple times per second
  update: function() {
    // Rotates animal
    //this.sheep.angle += 0.5;
  },

//************************************************************************************//

  animateAnimal: function (sprite, event) {
      sprite.play('animate');

      sprite.customParams.sound.play();
  },

//************************************************************************************//  

  //switch animal
  switchAnimal: function (sprite, event) {

    //if animation is taking place don't do anything
    if(this.isMoving){
      return false;
    }

    this.isMoving = true;

    //hide text
    this.animalText.visible = false;

    var newAnimal, endX;
    
    //according to the arrow pressed, which animal comes in
    if(sprite.customParams.direction > 0){
      newAnimal = this.animals.next();
      newAnimal.x = -newAnimal .width/2;
      endX = 640 + this.currentAnimal.width/2;
    }
    else {
      newAnimal = this.animals.previous();
      newAnimal.x = 640 + newAnimal.width/2;
      endX = -this.currentAnimal.width/2;
    }

    //tween animations, moving on x
    var newAnimalMovement = this.game.add.tween(newAnimal);
    newAnimalMovement.to({x: this.game.world.centerX}, 1000);
    newAnimalMovement.onComplete.add(function()
    {
      this.isMoving = false;
      this.showText(newAnimal);
    }, this);
    newAnimalMovement.start();

    var currentAnimalMovement = this.game.add.tween(this.currentAnimal);
    currentAnimalMovement.to({x: endX}, 1000);
    currentAnimalMovement.start();

    this.currentAnimal = newAnimal;

  },

  showText: function(animal){
    if(!this.animalText) {
      var style = {
        font: 'bold 30pt Arial',
        fill: '#D0171B',
        align: 'center'
      };
      this.animalText = this.game.add.text(this.game.width/2, this.game.height * 0.85, '', style);
      this.animalText.anchor.setTo(0.5);
    }

    this.animalText.setText(animal.customParams.text);
    this.animalText.visible = true;
  }

};

//************************************************************************************//

//initiate the Phaser framework
var game = new Phaser.Game(640, 360, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');











