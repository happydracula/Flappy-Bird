//Canvas declarations
const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth ;
canvas.height = window.innerHeight;
console.log(100/canvas.width);
//TODO:::Optimize for mobile responsiveness
addEventListener("resize", function () {
  canvas.width = (window.innerWidth);
  canvas.height = window.innerHeight;
  bird.y=(canvas.height-(grassRatio*canvas.height))/2
  gameScreen("gameStart");
  });
  
const c = canvas.getContext("2d");
  //
  //Audio variable declaration
   var collision=document.getElementById("collision");
   var fly=document.getElementById("fly");
   fly.volume =0.1;
   collision.volume=0.3;
//

  //Values for adjusting components for different window sizes
  const soilRatio = 0.09283819628647215;
  const grassRatio = 0.11936339522546419;
  const randBuildingRatio=0.5305039787798409;
  const fixedBuildingRatio = 0.06631299734748011;
  const randIntervalRatio = 0.13262599469496023;
  const fixedIntervalRatio=0.09946949602122016;
  const obstacleWidthRatio = 0.06510416666666667;
  //
  //Values related to movement
var v = 3;
var birdv = 5;
var g = 0;
//
//Values related to game parameters
var score=0;
var gameOver=false;
var img = new Image();
var pic = 1;//Index of frame of bird animation to be displayed
var frames = 0;//Keeps track of current frame.
var bestScore=0
var obstacles = [];
var startGame = true;
var strip = {   //Start values of canvas pen for drawing stripes
  x: 0,
  y: canvas.height - soilRatio * canvas.height,
};
var stripes = [];
var startingPoint = 0;
var cont = true;//Controls requestAnimationFrame
//

//Constructors
function Obstacle(x,y,height){
  this.x=x;
  this.y=y;
  this.height=height;
  this.crossed=false;
  this.draw=function(){
    if(this.y==0){
    c.fillStyle = "#78CE35";
    c.fillRect(this.x,this.y,obstacleWidthRatio*canvas.width,this.height-20);
    c.strokeStyle="black";
    c.strokeRect(
      this.x,
      this.y,
      obstacleWidthRatio * canvas.width,
      this.height - 20
    );
    c.fillRect(
      this.x - 5,
      this.height - 20,
      obstacleWidthRatio * canvas.width+10,
      20
    );
    c.strokeRect(
      this.x - 5,
      this.height - 20,
      obstacleWidthRatio * canvas.width+10,
      20
    );

    }
    if(this.y==canvas.height-grassRatio*canvas.height){
      c.fillStyle = "#78CE35";
      c.fillRect(this.x,this.y,obstacleWidthRatio*canvas.width,-this.height+20);
      c.strokeStyle = "black";
      c.strokeRect(
        this.x,
        this.y,
        obstacleWidthRatio * canvas.width,
        -this.height + 20
      );
      c.fillRect(
        this.x - 5,
        canvas.height - grassRatio * canvas.height - this.height + 20,
        obstacleWidthRatio * canvas.width+10,
        -20
      );
      c.strokeRect(
        this.x - 5,
        canvas.height - grassRatio * canvas.height - this.height + 20,
        obstacleWidthRatio * canvas.width+10,
        -20
      );

    }
  }
}
function Bird(x,y,dy,index){
  this.x=x;
  this.y=y;
  this.dy=dy;
  this.index=index;
  this.g=g
  this.draw=function(){  //Draws frame of bird animation according to picture index
    img.src = `./images/sprites/Frame-${this.index}.png`;
    var yval=this.y;
    img.onload=function(){
      
      c.drawImage(img,canvas.width/2,yval,40,40);
      
    }
  }
  this.update=function(){
    this.draw();
    this.y+=this.dy;
    this.dy+=this.g;
  }
}
function Cloud(x,y){
  this.x=x;
  this.y=y;
  this.draw=function(){
  var xval=this.x;
  var yval=this.y;
  img.src = "./images/cloud.png";
  img.onload=function(){
    c.drawImage(img,300,400,120,120);
    c.fillStyle="white";
    c.fill();
  }
  }
}
function Stripe(x, y, dx) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.draw = function () {
    c.beginPath();
    c.moveTo(this.x, canvas.height - soilRatio * canvas.height);
    c.lineTo(
      this.x + 15,
      canvas.height -
        soilRatio * canvas.height -
        (grassRatio - soilRatio) * canvas.height
    );
    c.shadowBlur = 0;
    c.strokeStyle = "black";
    c.stroke();
    c.closePath();
  };
  this.update = function () {
    this.draw();
    this.x -= v;
  };
}
//

//Bird Creation
var bird = new Bird(canvas.width / 2, canvas.height / 2, 0, pic);
//

//Function For Creating Obstacles
function obstacleInit() {  //Pushes an obstacle pair into obstacles array
  var interval = Math.random() * 80 + 100;//Gap between two obstacles
  var x = canvas.width + 200;//All obstacles are created at same spot
  var h1 =
    Math.random() * randBuildingRatio * canvas.height +
    fixedBuildingRatio * canvas.height;

  var h2 = canvas.height - grassRatio * canvas.height - interval - h1;
  var o1 = new Obstacle(x, 0, h1);
  var o2 = new Obstacle(x, canvas.height - grassRatio * canvas.height, h2);
  obstacles.push(o1);
  obstacles.push(o2);
}
//
//Event handler for movement of bird and starting of game
addEventListener("keydown",function(event){
  
  if(event.which==32){  //Spacebar
    //Animate function only called when startGame is true and spacebar is hit
    //startGame is true only on load and when gameOver
    //Reset of game on startGame
    if(startGame){
      score=0;
      obstacles=[];
      cont =true;
      v = 3;
      bird.y = canvas.height / 2;
      birdv = 5;
      bird.dy = 5;
      bird.g = 0;
      g = 0;
      gameOver=false
      animate();
      startGame=false;//Ensures spacebar doesnt reset game 
    }
    
  }
  if(event.key=="ArrowUp"||event.key=="w"||event.which==32){
    fly.pause()
    fly.currentTime=0
    bird.dy=-birdv;
    bird.g = 0.25;
    fly.play();
  }
  
});
//

//Function for creating stripes
//Continually creates stripes at intervals of 30 upto a length of canvas.width+15
function stripeInit(){
  while(strip.x<startingPoint+canvas.width+15){
var stripe = new Stripe(strip.x, strip.y, v);
stripes.push(stripe);
strip.x+=30
  }
  startingPoint=strip.x;
}
//

//Animate Function
function animate() {
  if(cont){
  requestAnimationFrame(animate);
  }
    setTimeout(function () {
      gameScreen("")
    }, 0);
    if(frames==0||frames%100==0){ //Every 100 frames new stripes are formed
   stripeInit();
 }
    if(frames==0||frames%200==0){
      //Every 100 frames new obstacles are formed
      obstacleInit();
    }
 
 if(cont){
   //Every 10 frames bird is updated to show its next frame
  if (frames == 0 || frames % 10 == 0) {
    
    if(pic<=3){
      pic+=1;
    }
    if(pic==4){
      pic=1;
    }
    bird.index=pic;
}
 }
 setTimeout(function () {
   //Score Display
   c.font="50px Cursive";
   c.fillStyle="white"
   c.strokeStyle="black"
   c.fillText(`${score}`,bird.x,100);
   c.strokeText(`${score}`, bird.x, 100);
if(gameOver){ //Text that displays only when gameOver
   c.font = "40px Cursive";
   c.fillText("Hit SpaceBar To ReStart!", bird.x - 200, 300);
   c.strokeText("Hit SpaceBar To ReStart!", bird.x - 200, 300);
   startGame=true;
   }
bird.update();
 }, 5);

//Collision Checking for each obstacle
 for(var i=0;i<obstacles.length;i++){
   
   if(bird.x>=obstacles[i].x&&bird.x<=obstacles[i].x+100){
     if (obstacles[i].y == 0) {
       if (
         bird.y >= obstacles[i].y &&
         bird.y <= obstacles[i].y + obstacles[i].height
       ) {
        onGameOver();
         }
     } else {
     if(bird.y>=obstacles[i].y-obstacles[i].height-40&&bird.y<=obstacles[i].y){
      onGameOver()
       }
   }
 }

 if(!obstacles[i].crossed&&bird.x>obstacles[i].x+100){
   score+=0.5;//Each obstacle crossed adds 0.5 to score.Since obstacles come in
              //pairs,score is immediatley updated on screen as +1
   obstacles[i].crossed=true;//This parameter ensures that once crossed,
                             //The obstacle no longer triggers score increment
  }
}
//Condition for bird falling onto ground
if(bird.y>canvas.height-grassRatio*canvas.height){
   onGameOver();
   }
 
 frames += 1;

}
//



//Function for Game over Conditions
function onGameOver(){
  //Velocities of bird,Ground and gravity are set to 0.In addition to stopping animation
   v = 0;
   birdv = 0;
   bird.dy = 0;
   bird.g = 0;
   g = 0;
   cont = false;
   if (score > bestScore) {
     bestScore = score;
   }
   gameOver = true;
   collision.play()
}
//

//Function to display Game screen
function gameScreen(status){
  
  if(status=="gameStart"){
    stripeInit();
  }
  //Canvas code for drawing background
  c.shadowBlur = 0;
  c.fillStyle = "rgb(14, 196, 200)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.shadowBlur = 0;
  c.fillStyle = "#DADA94";
  c.fillRect(
    0,
    canvas.height - soilRatio * canvas.height,
    canvas.width,
    soilRatio * canvas.height
  );
  c.fillStyle = "#A3F85F";
  c.shadowColor = "black";
  c.shadowBlur = 2;
  c.fillRect(
    0,
    canvas.height - grassRatio * canvas.height,
    canvas.width,
    (grassRatio - soilRatio) * canvas.height
  );
  c.strokeRect(
    0,
    canvas.height - grassRatio * canvas.height,
    canvas.width,
    (grassRatio - soilRatio) * canvas.height
  );
  //

  //Draws And updates obstacles
  for (var i = 0; i < obstacles.length; i++) {
    if (obstacles[i].x < -120) {
      obstacles.splice(i, 1);
      i = i - 1;
    } else {
      obstacles[i].x -= v;
      obstacles[i].draw();
    }
  }
  //Draws and updates stripes
  for (var i = 0; i < stripes.length; i++) {
    if (stripes[i].x < -5) {
      stripes.splice(i, 1);
      i = i - 1;
    } else {
      stripes[i].update();
    }
  }
  if(status=="gameStart"){
    
    bird.draw()
      //Canvas code for starting text 
      c.font = "50px Cursive";
      c.fillStyle = "white";
      c.strokeStyle = "black";
      c.fillText(`${score}`, bird.x, 100);
      c.strokeText(`${score}`, bird.x, 100);
      c.font = "40px Cursive";
      c.fillStyle = "white";
      c.strokeStyle = "black";
      c.fillText("Hit SpaceBar To Start!",bird.x-200,300);
      c.strokeText("Hit SpaceBar To Start!", bird.x-200, 300);
  }
  c.font = "30px Cursive";
  c.fillStyle = "azure";
  c.strokeStyle = "black";
  c.fillText(`Best:${bestScore}`,30,50);
}
//

//Game Screen On page load without animation
gameScreen("gameStart");