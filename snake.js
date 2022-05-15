//Initialisation & Declaration (Needed later)
var context = document.getElementById("canvas").getContext("2d");
var snakeArray = [new Snake(10, 10)];
var foodArray = [];
var obstacleArray = [];
var score = 0;
var colour = "#FFF";

//Create some food before the program begins and we draw
//So it is visible on screen before the game starts
CreateFood();

//Draw it on our canvas
Draw();

//This is our object that we use for each block of our snake
//Each blocks only needs to know it's X and Y position
function Snake(XPos, YPos) {
  this.XPos = XPos;
  this.YPos = YPos;
}

//Our food object, simply needs to know where it is
function Food(XPos, YPos) {
  this.XPos = XPos;
  this.YPos = YPos;
}

//A function to create food for our snake to eat
function CreateFood() {
  //To our foodArray we add a new food using a long math randomization and rounding formula to give it a random position on the canvas
  foodArray.push(new Food((Math.round((~~((Math.random() * 370) + 10) / 10)) * 10), (Math.round((~~((Math.random() * 370) + 10) / 10)) * 10)));

  //These two make sure food isn't on or next to snake head
  if (foodArray[0].XPos > snakeArray[0].XPos - 10 && foodArray[0].XPos < snakeArray[0].XPos + 10) {
    foodArray.pop();
    CreateFood();
  }
  else if (foodArray[0].YPos > snakeArray[0].YPos - 10 && foodArray[0].YPos < snakeArray[0].YPos + 10) {
    foodArray.pop();
    CreateFood();
  }
}

//Our obstacle object, simply needs to know where it is
function Obstacle(XPos, YPos) {
  this.XPos = XPos;
  this.YPos = YPos;
}

//A function to generate obstacles to put into our array
function GenerateObstacles() {
  //Loop to create however many obstacles we want
  for (var h = 0; h < 10; h += 1) {
	  
	//Using the same mathematical formula as for the food we push a new obstacle into the array using a math expression
    obstacleArray.push(new Obstacle((Math.round((~~((Math.random() * 370) + 10) / 10)) * 10), (Math.round((~~((Math.random() * 370) + 10) / 10)) * 10)));
	
	//Makes sure the obstacles don't spawn on top of our snake or on top of our food
    if (obstacleArray[h].XPos > snakeArray[0].XPos - 10 && obstacleArray[h].XPos < snakeArray[0].XPos + 10) {
      h -= 1;
      obstacleArray.pop();
    }
    else if (obstacleArray[h].YPos > snakeArray[0].YPos - 10 && obstacleArray[h].YPos < snakeArray[0].YPos + 10) {
      h -= 1;
      obstacleArray.pop();
    }
    else if (obstacleArray[h].YPos > foodArray[0].YPos - 10 && obstacleArray[h].YPos < foodArray[0].YPos + 10) {
      h -= 1;
      obstacleArray.pop();
    }
  }
}

//Variables for function below
var colourInterval;
var stopTimeout;
var canEatobstacles = false;

//This function makes our snake turn rainbow colours and allows us for a time to eat the obstacles on the canvas
function EatObstacles() {
  //At interval change our colour to random one
  colourInterval = setInterval(function() {colour = '#'+(Math.random()*0xFFFFFF<<0).toString(16);}, 50);
  stopTimeout = setTimeout(function() {clearInterval(colourInterval); colour = "#FFF"; canEatobstacles = false;}, 10000);
  canEatobstacles = true;
}

//The draw function draws our canvas with our snake, food and obstacles
function Draw() {
  //Clear our canvas
  context.clearRect(0,0,400,400);
  
  //Set our colour for the food and then loop through the food array drawing every bit of food
  context.fillStyle = "#F00";
  for (var i = 0; i < foodArray.length; i += 1) {
    context.fillRect(foodArray[i].XPos, foodArray[i].YPos, 10, 10);
  }
  
  //Set our colour to the current snake color (eat obstacles makes the snake change through the rainbow)
  //and then draw our snake
  context.fillStyle = colour;
  for (var j = 0; j < snakeArray.length; j += 1) {
    context.fillRect(snakeArray[j].XPos, snakeArray[j].YPos, 10, 10);
  }
  
  //When we are at level 2 or above and obstacles exist we draw them too
  if (level >= 2) {
    context.fillStyle = "#FF0";
    for (var i = 0; i < obstacleArray.length; i += 1) {
      context.fillRect(obstacleArray[i].XPos, obstacleArray[i].YPos, 10, 10);
    }
  }
}

//We start at level 1
var level = 1;

//This function checks collision between all the different objects on our canvas
//Allowing us to detect if the snake head is on the snake's tail, food or an obstacle
//And then acts accordingly
function CheckCollision() {
  //If the snake hits the side of the canvas
  if (snakeArray[0].XPos == -10 || snakeArray[0].XPos == 400 || snakeArray[0].YPos == -10 || snakeArray[0].YPos == 400) {
    Lose();
  }

  //If the snake head is on our food
  if (snakeArray[0].XPos == foodArray[0].XPos && snakeArray[0].YPos == foodArray[0].YPos) {  
    //Remove current food and create new food and add a new block to our snake
    foodArray.pop();
    CreateFood();
    snakeArray.push(new Snake(-10, -10));

	//Increment our score and if it's divisible by 5, increase the level
    score += 1;
    document.getElementById("scoreDiv").innerHTML = score;
    if (score % 5 === 0) {
      level += 1;
      ChangeLevel(level);
    }
  }
  
  //If we have a tail then check that we aren't eating it
  if (snakeArray.length != 1) {
    for (var k = 1; k < snakeArray.length; k += 1) {
      if (snakeArray[0].XPos == snakeArray[k].XPos && snakeArray[0].YPos == snakeArray[k].YPos) {
        Lose();
      }
    }
  }
  
  //If we are high enough level and can't eat obstacles we lose if we run into them
  if (level >= 2 && canEatobstacles == false) {
    for (var m = 0; m < obstacleArray.length; m += 1) {
      if (snakeArray[0].XPos == obstacleArray[m].XPos && snakeArray[0].YPos == obstacleArray[m].YPos) {
        Lose();
      }
    }
  }
  
  //If we can eat obstacles then allow us to 'eat' them by removing them from our array
  else if (level >= 2 && canEatobstacles == true) {
    for (var n = 0; n < obstacleArray.length; n += 1) {
      if (snakeArray[0].XPos == obstacleArray[n].XPos && snakeArray[0].YPos == obstacleArray[n].YPos) {
        obstacleArray.splice(n, 1);
      }
    }
  }
}

//Change our level and set the according values and trigger the proper functions
function ChangeLevel(num) {
  if (num == 2) {
    speed = 75;
    clearInterval(interval);
    interval = setInterval(function() {Move(savedInterval);}, speed);
  }
  if (num % 3 == 0) {
    EatObstacles();
  }
  else if (num >= 2) {
    GenerateObstacles();
  }
}

//Disable control when we lose
function DisableControl() {
  document.removeEventListener("keydown", KeydownFunc);
  document.getElementById("startBtn").innerHTML = "Start";
  document.getElementById("startBtn").removeEventListener("click", Pause);
  document.getElementById("startBtn").addEventListener("click", Start); 
}

//Make us lose by clearing everything disabling our control and restarting the game
//by resetting all values to intial ones
function Lose() {
  clearInterval(interval);
  DisableControl();
  window.alert("You died!")
  Restart();
}

function Restart() {
  //Snake.JS
  score = 0;
  document.getElementById("scoreDiv").innerHTML = "0";
  snakeArray = [new Snake(10, 10)];
  foodArray = [];
  obstacleArray = [];
  CreateFood();
  Draw();

  //Keypress.JS
  speed = 150;
  savedInterval = "Right";
  document.getElementById("startBtn").removeEventListener("click", Pause);
  document.getElementById("startBtn").addEventListener("click", Start);
}