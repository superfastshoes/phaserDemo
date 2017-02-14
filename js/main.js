//this game will have only 1 state
var GameState = {
  //load the game assets before the game starts
  preload: function() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('arrow', 'assets/images/arrow.png');
    // this.load.image('chicken', 'assets/images/chicken.png');
    // this.load.image('horse', 'assets/images/horse.png');
    // this.load.image('pig', 'assets/images/pig.png');
    // this.load.image('sheep', 'assets/images/sheep3.png');

    //specify width, height, and number of frames.
    this.load.spritesheet('chicken', 'assets/images/chicken_spritesheet.png', 131, 200, 3);
    this.load.spritesheet('horse', 'assets/images/horse_spritesheet.png', 212, 200, 3);
    this.load.spritesheet('pig', 'assets/images/pig_spritesheet.png', 297, 200, 3);
    this.load.spritesheet('sheep', 'assets/images/sheep_spritesheet.png', 244, 200, 3);

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
    
    /////////////// Examples on how to add and munipulate single sprites /////////////////////////////
    // Add a chicken to the center of the world
    //this.chicken = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY,'chicken');
    // Place the sprite by it center, not the top-left corner
    //this.chicken.anchor.setTo(0.5);
    //this.chicken.scale.setTo(2, 1);

    // Add a horse
    //this.horse = this.game.add.sprite(120, 10, 'horse');
    //this.horse.scale.setTo(0.5);

    //Add a sheep
    //this.sheep = this.game.add.sprite(100, 250, 'sheep');
    //this.sheep.scale.setTo(0.5);
    //this.sheep.anchor.setTo(0.5);
    //this.sheep.angle = 90;

    // Add pig
    //this.pig = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'pig');
    //this.pig.anchor.setTo(0.5);
    // Flip on x-axis
    //this.pig.scale.setTo(-1, 1);
    // Enable user input on sprite
    //this.pig.inputEnabled = true;
    //this.pig.input.pixelPerfectClick = true;
    //this.pig.events.onInputDown.add(this.animateAnimal, this);
    //////////////////////////////////////////////////////////////////////////////////////////////////

    var animalData = [
      {key: 'chicken', text: 'CHICKEN'},
      {key: 'horse', text: 'HORSE'},
      {key: 'pig', text: 'PIG'},
      {key: 'sheep', text: 'SHEEP'}
    ];

    //create a group to store all animals
    this.animals = this.game.add.group();

    //cant access 'this' in froEach loop.
    var self = this;
    var animal;
    
    //* maybe use this to make dyanamic backgrounds for game. *//
    animalData.forEach(function(element){
      //create each animal and put it in the group
      animal = self.animals.create(-1000, self.game.world.centerY, element.key, 0);

      //save everything that's not phaser-related in a custom property
      animal.customParams = {tecxt: element.text};
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
  },

//************************************************************************************//  

  //switch animal
  switchAnimal: function (sprite, event) {
    //1. get the direction of the arrow -
    //2. get the next animal -
    //3. get the final destination of the current animal -
    //4. move the current animal to final destination -
    //5. set the next animal as the new current animal -

    if(this.isMoving){
      return false;
    }

    this.isMoving = true;

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
    newAnimalMovement.onComplete.add(function(){
      this.isMoving = false;
    }, this);
    newAnimalMovement.start();

    var currentAnimalMovement = this.game.add.tween(this.currentAnimal);
    currentAnimalMovement.to({x: endX}, 1000);
    currentAnimalMovement.start();


    this.currentAnimal = newAnimal;

  }
};

//************************************************************************************//

//initiate the Phaser framework
var game = new Phaser.Game(640, 360, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');