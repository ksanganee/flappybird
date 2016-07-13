// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)

var width = 790;
var height = 400;
var rotation = 200;
var gameGravity = 625;
var jumpPower = -250;
var gapSize = 150;
var gapMargin = 50;
var blockHeight = 40;
var splashDisplay;
var pipespeed = -450;

var easyTag;
var mediumTag;
var hardTag;




var easyMode = {
  pipespeed: -200,
  gameGravity: 500,
  jumpPower: -250,
  gapSize: 150,
  gapMargin: 50,
};


var mediumMode = {
  pipespeed : -450,
  gameGravity : 625,
  jumpPower : -200,
  gapSize : 105,
  gapMargin : 100,
};

var hardMode = {
  pipespeed : -700,
  gameGravity : 750,
  jumpPower : -150,
  gapSize : 80,
  gapMargin : 100,
};

var modes = {
  easy: easyMode,
  medium: mediumMode,
  hard: hardMode
};


function start() {
  game.input.onDown.add(clickHandler);
  game.input
  .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
  .onDown.add(spaceHandler);

  splashDisplay.destroy();


  //alert(score);

  game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
  .onDown.add(moveRight);

  game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
  .onDown.add(moveLeft);

  game.input.keyboard.addKey(Phaser.Keyboard.UP)
  .onDown.add(moveUp);

  game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
  .onDown.add(moveDown);



  player.body.velocity.x = 0;
  player.body.gravity.y = gameGravity;

}

function begingame() {
  var pipeInterval = 1.5 * Phaser.Timer.SECOND;
  game.time.events.loop(
    pipeInterval,
    generatePipe
  );
}

  /*var timeToFirstPipe = 3.5 * Phaser.Timer.SECOND;
  game.time.events.add(
    timeToFirstPipe,
    function() {
      game.time.events.loop(
        pipeInterval, changeScore);});*/



var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
var score = 0;

var player;


var labelScore;

var pipes = [];

var scoreObjects = [];
/*
 * Loads all resources for the game and gives them names.
 */

function preload() {
  game.load.image("playerImg", "assets/flappybirdappicon.gif");
  game.load.image("spriteImg", "assets/mariosprite.png");
  game.load.audio("score", "assets/point.ogg");
  game.load.image("scoringstarImg", "assets/scoringstar.png");

  game.load.image("easybutton", "assets/easybutton.jpg");
  game.load.image("mediumbutton", "assets/mediumbutton.jpg");
  game.load.image("hardbutton", "assets/hardbutton.jpg");

  game.load.image("pipeBlock","assets/football.png");
  game.load.image("backgroundImg", "assets/background.jpg");
}

/* var easybutton = easyTag
 var mediumbutton = mediumTag
 var hardbutton = hardTag */
/*
 * Initialises the game. This function is only called once.
 */

function create() {
  var backGround = game.add.image(0, 0, "backgroundImg");
  backGround.width = 790;
  backGround.height = 400;

  /*game.add.text(
    429, 19,
    "Hi, this is my version of Flappy Bird",
    {font: "20px Comic Sans MS", fill: "#000080"});
    */

    labelScore = game.add.text(20, 20, "0");

//corner one

  var playerSprite = game.add.sprite(17, 325, "playerImg");
  playerSprite.width = 60;
  playerSprite.height = 60;



  player = game.add.sprite(100, 200, "spriteImg");
  player.height = 80;
  player.width = 50;

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.enable(player);

  player.anchor.setTo(0.5, 0.5);

  game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
  .onDown.add(start);

  splashDisplay = game.add.text(100,15, "Press Enter to begin and Spacebar to jump", {font: "30px Comic Sans MS", fill: "#FFFF00"});

  /*setMode(modes.easy);
  setMode(modes.medium);
  setMode(modes.hard);*/

  easyTag = game.add.sprite(350, 100, "easybutton");
  easyTag.height=50;
  easyTag.width=50;
    game.physics.arcade.enable(easyTag);
    easyTag.body.velocity.x = -40;

  mediumTag = game.add.sprite(350, 200, "mediumbutton");
  mediumTag.width=50;
  mediumTag.height=50;
    game.physics.arcade.enable(mediumTag);
    mediumTag.body.velocity.x = -40;

  hardTag = game.add.sprite(350, 300, "hardbutton");
  hardTag.width=50;
  hardTag.height=50;
    game.physics.arcade.enable(hardTag);
    hardTag.body.velocity.x = -40;





}



/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
  game.physics.arcade.overlap(
    player,
    pipes, gameOver);

  game.physics.arcade.overlap(
    player, easyTag, setEasyMode);

  game.physics.arcade.overlap(
    player, mediumTag, setMediumMode);

  game.physics.arcade.overlap(
    player, hardTag, setHardMode);


    if(player.body.y < 0) {
      gameOver();
    }

    if (player.body.y > 400){
      gameOver();
    }

  player.rotation += 1;
  player.rotation = Math.atan(player.body.velocity.y / rotation);

  for(var i = scoreObjects.length - 1; i >= 0; i--){
      game.physics.arcade.overlap(player, scoreObjects[i], function(){
          changeScore();
          scoreObjects[i].destroy();
          scoreObjects.splice(i, 1);

      });
  }
}

function setEasyMode() {
  setMode(modes.easy);
  begingame();
  killbuttons();
}

function setMediumMode() {
  setMode(modes.medium);
  begingame();
  killbuttons();
}

function setHardMode() {
  setMode(modes.hard);
  begingame();
  killbuttons();
}

function gameOver() {
  //alert("haha u lost");
  score = 0;
  game.state.restart();
  //location.reload();
}

function clickHandler(event) {
var playerSprite = game.add.sprite(event.x-25, event.y-25, "playerImg");
playerSprite.width = 10;
playerSprite.height = 10;
}


function killbuttons() {
  easyTag.destroy();
  mediumTag.destroy();
  hardTag.destroy();
}
  //alert("You just clicked in the position: " + event.x + " , " + event.y);

function spaceHandler() {
  game.sound.play("score");
  player.body.velocity.y = jumpPower;
}

function changeScore() {
  score = score + 1;
  labelScore.text = score;
}

function moveRight() {
  player.x = player.x +10;
}

function moveLeft() {
  player.x = player.x -10;
}

function moveUp() {
  player.y = player.y -10;
}

function  moveDown() {
  player.y = player.y +10;
}

function generatePipe() {

  var gap = game.rnd.integerInRange(1 ,5);
  var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

    for(var y = gapStart; y > 0; y -= blockHeight){
        addPipeBlock(width, y - blockHeight);
    }


    addscoretracker(width,  gapStart + gapSize / 2);



    for(y = gapStart + gapSize; y < height; y += blockHeight) {
        addPipeBlock(width, y);
    }
    //  changeScore();




  }

function addPipeBlock(x, y) {
  var pipeBlock = game.add.sprite(x,y,"pipeBlock");
  pipeBlock.scale.setTo(0.05, 0.05);
  pipes.push(pipeBlock);
  game.physics.arcade.enable(pipeBlock);
  pipeBlock.body.velocity.x = pipespeed;
}


function addscoretracker(x, y) {
var scoreTracker = game.add.sprite(x, y, "scoringstarImg");
scoreTracker.scale.setTo(0.1, 0.1);
scoreObjects.push(scoreTracker);

game.physics.arcade.enable(scoreTracker);
scoreTracker.body.velocity.x = pipespeed;


}

function setMode(mode) {
  pipeInterval = mode.pipeInterval;
  pipespeed = mode.pipespeed;
  gameGravity = mode.gameGravity;
  gapSize = mode.gapSize;
}
