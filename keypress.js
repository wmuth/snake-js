//Initialisation & Declaration (Needed later)
document.getElementById("startBtn").addEventListener("click", Start);
var interval;
var speed = 150;
var savedInterval = "Right";

//Starts the game by adding keychecking interval, listeners and changing button functionality
function Start() {
  interval = setInterval(function() {Move(savedInterval)}, 150);
  document.addEventListener("keydown", KeydownFunc);
  document.getElementById("startBtn").innerHTML = "Pause";
  document.getElementById("startBtn").removeEventListener("click", Start);
  document.getElementById("startBtn").addEventListener("click", Pause);
}

//Pauses the game, removes listeners, clearsInterval...
function Pause() {
  clearInterval(interval);
  document.removeEventListener("keydown", KeydownFunc);
  document.getElementById("startBtn").innerHTML = "Play";
  document.getElementById("startBtn").removeEventListener("click", Pause);
  document.getElementById("startBtn").addEventListener("click", Start);
}

//Checks what key was pressed
//And sets which direction the snake should move in by interval
function KeydownFunc(pressedKey) {
  //If key is Left Arrow
  if (pressedKey.keyCode == 37) {
	//Remove the current interval running our function with a certain parameter at a certain interval
    clearInterval(interval);
	
	//Set a new parameter to run at a certain interval
    interval = setInterval(function() {Move("Left");}, speed);
  }
  if (pressedKey.keyCode == 38) {
    clearInterval(interval);
    interval = setInterval(function() {Move("Up");}, speed);
  }
  if (pressedKey.keyCode == 39) {
    clearInterval(interval);
    interval = setInterval(function() {Move("Right");}, speed);
  }
  if (pressedKey.keyCode == 40) {
    clearInterval(interval);
    interval = setInterval(function() {Move("Down");}, speed);
  }
}

//Moves our snake based on the paramter direction
//To control how fast we move we control how often we call this function
var tempSaved;
function Move(direction) {
  //Change our tailblocks position values
  TailChangePos();
  
  if (snakeArray.length == 2) {
    tempSaved = savedInterval;
  }
  if (direction == "Left") {
    savedInterval = "Left";
    snakeArray[0].XPos -= 10;
  }
  else if (direction == "Up") {
    savedInterval = "Up";
    snakeArray[0].YPos -= 10;
  }
  else if (direction == "Right") {
    savedInterval = "Right";
    snakeArray[0].XPos += 10;
  }
  else if (direction == "Down") {
    savedInterval = "Down";
    snakeArray[0].YPos += 10;
  }
  
  //Fix so we can't turn the direction we were going when the snake is 2 blocks long
  if (snakeArray.length == 2) {
    if (tempSaved == "Left" && savedInterval == "Right") Lose();
    if (tempSaved == "Right" && savedInterval == "Left") Lose();
    if (tempSaved == "Up" && savedInterval == "Down") Lose();
    if (tempSaved == "Down" && savedInterval == "Up") Lose();
  }
  
  //Check collision with other parts of snake, obstacles or food
  CheckCollision();
  
  //Draw it all out on our screen with the updated information
  Draw();
}

//This function moves our snakes tailblocks X and Y positions down the tail
//It works by starting at the back of the tail and having each block copy the values of the block in front of it
function TailChangePos() {
  if (snakeArray.length != 1) {
    for(var i = snakeArray.length - 1; i >= 1; i -= 1) {
      snakeArray[i].XPos = snakeArray[i - 1].XPos;
      snakeArray[i].YPos = snakeArray[i - 1].YPos;
    }
  }
}