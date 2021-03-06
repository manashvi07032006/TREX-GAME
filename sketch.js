var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var checkSound, dieSound, jumpSound;
var gameOver, restart;
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  checkSound = loadSound("checkPoint.mp3");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
}


function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  trex.addAnimation("collided", trex_collided);
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.velocityX = -4;
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  gameOver = createSprite(300 ,80);
  gameOver.addImage("over", gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  restart = createSprite(300, 120);
  restart.addImage("rego", restartImg);
  restart.visible = false;
  restart.scale = 0.5;
  
  score = 0;
}

function draw() {
  background(180);
  
  text("Score: "+ score, 500,50);
  
if(gameState === PLAY){
    if(keyDown("space") && trex.y>=100) {
    trex.velocityY = -10;
  }
  if(keyWentDown("space")){
     jumpSound.play();
     }
  
  trex.velocityY = trex.velocityY + 0.8;
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  score = score + Math.round(getFrameRate()/60);
  
  spawnClouds();
  spawnObstacles();
  
  if (score>0 && score%100 === 0){
      checkSound.play();
    }
  
  if(obstaclesGroup.isTouching(trex)){
    dieSound.play();
    gameState = END;
  }
}
if(gameState === END){
  
  gameOver.visible = true;
  restart.visible = true;
  ground.velocityX=0;
  trex.x = 50;
  trex.y = 180;
  trex.velocityY = 0;
  trex.changeAnimation("collided", trex_collided);
  cloudsGroup.setVelocityXEach(0);
  obstaclesGroup.setVelocityXEach(0);
  cloudsGroup.setLifetimeEach(-1);
  obstaclesGroup.setLifetimeEach(-1);
  
  if(mousePressedOver(restart)){
    reset();
  }
}
trex.collide(invisibleGround);
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -4;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score = 0;
}