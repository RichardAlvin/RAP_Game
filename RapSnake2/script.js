//Referensi
//https://www.section.io/engineering-education/how-to-build-a-snake-game-with-javascript/

const canvas=document.getElementById('game'); 
const ctx=canvas.getContext('2d');

class snakePart{
    constructor(x, y){
        this.x=x;
        this.y=y;
    }
}

let speed=7; //The interval will be seven times a second.

let tileCount=20;
let tileSize=18;
let headX=10;
let headY=10;

//initialize the speed of snake
let xvelocity=0;
let yvelocity=0;

//draw apple
let appleX=5;
let appleY=5;

// array for snake parts
const snakeParts=[];
let tailLength=2; //initial parts of snake

//scores
let score=0;

//key
const STORAGE_KEY_Stage = 'RAP_Wordle_Stage';
let stage;

document.addEventListener('DOMContentLoaded', function () {
    //localStorage.clear();
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
}

function loadDataFromStorage() {
    stage = localStorage.getItem(STORAGE_KEY_Stage);

    if (stage == null) stage = 1;

    // document.dispatchEvent(new Event(RENDER_EVENT));
}

function drawGame(){
    changeSnakePosition();

    // game over logic
    let result=isGameOver();
    if(result){// if result is true stop other following function from exucuting
        return;
    }

    clearScreen(stage);
    drawSnake();

    drawApple();
    checkCollision(); 

    drawScore();

    setTimeout(drawGame, 1000/speed);//update screen 7 times a second
}

// score function
function drawScore(){
    ctx.fillStyle="white"// set our text color to white
    ctx.font="20px verdena"//set font size to 10px of font family verdena
    ctx.fillText("Score: " +score, canvas.clientWidth-90,30);// position our score at right hand corner
}

function clearScreen(stage){
    ctx.fillStyle= 'black'// make screen black

    if(stage == 1){
        ctx.fillRect(0,0,canvas.clientWidth,canvas.clientHeight);
    }else{
        console.log(stage);
        ctx.fillRect(0,0,canvas.clientWidth,canvas.clientHeight);
    }
}

function drawSnake(){

    ctx.fillStyle="green";
    //loop through our snakeparts array
    for(let i=0;i<snakeParts.length;i++){
        //draw snake parts
        let part=snakeParts[i]
        ctx.fillRect(part.x *tileCount, part.y *tileCount, tileSize,tileSize)
    }
    snakeParts.push(new snakePart(headX,headY));//put item at the end of list next to the head

    if(snakeParts.length>tailLength){
        snakeParts.shift();//remove furthest item from  snake part if we have more than our tail size

    }
    ctx.fillStyle="orange";
    ctx.fillRect(headX* tileCount,headY* tileCount, tileSize,tileSize)
}

function changeSnakePosition(){
    headX=headX + xvelocity;
    headY=headY + yvelocity;
}

function keyDown(event){
    //up
    if(event.keyCode==38){
        if(yvelocity==1) return; //prevent snake from moving in opposite direction
        yvelocity=-1; //move one tile up
        xvelocity=0;

    }
    //down
    if(event.keyCode==40){
        if(yvelocity==-1) return;//prevent snake from moving in opposite direction
        yvelocity=1;//move one tile down
        xvelocity=0;
    }
    //left
    if(event.keyCode==37){
        if(xvelocity==1) return;//prevent snake from moving in opposite direction
        yvelocity=0;
        xvelocity=-1;//move one tile left
    }
    //right
    if(event.keyCode==39){
        if(xvelocity==-1) return;//prevent snake from moving in opposite direcction
        yvelocity=0;
        xvelocity=1;//move one tile right
    }
}

function drawApple(){
    ctx.fillStyle="red";// make apple red
    ctx.fillRect(appleX*tileCount, appleY*tileCount, tileSize, tileSize)//position apple within tile count
}

function checkCollision(){
    if(appleX==headX && appleY==headY){ //collision happens when left, right ,top, and bottom sides of apple is in contact with any part of snake
        appleX=Math.floor(Math.random()*tileCount); //generate apple to a random horizontal position
        appleY=Math.floor(Math.random()*tileCount);//generate apple to a random vertical position
        tailLength++;
        score++; //increase our score value
    }

    if(score == 40){
        GameWin();
    }
}

function GameWin(){
    alert("You Win, Go to next stage");
    stage++;
    localStorage.setItem(STORAGE_KEY_Stage, stage);
    score = 0;

    location.reload();
}

//Game Over function
function isGameOver(){
    let gameOver=false; 
    //check whether game has started
    if(yvelocity===0 && xvelocity===0){
        return false;
    }
    if(headX<0){//if snake hits left wall
        gameOver=true;
    }
    else if(headX===tileCount){//if snake hits right wall
        gameOver=true;
    }
    else if(headY<0){//if snake hits wall at the top
        gameOver=true;
    }
    else if(headY===tileCount){//if snake hits wall at the bottom
        gameOver=true;
    }

    //stop game when snake crush to its own body

     for(let i=0; i<snakeParts.length;i++){
         let part=snakeParts[i];
         if(part.x===headX && part.y===headY){//check whether any part of snake is occupying the same space
             gameOver=true;
             break; // to break out of for loop
         }
     }
    

    //display text Game Over
    if(gameOver){
     ctx.fillStyle="white";
     ctx.font="50px verdana";
     ctx.fillText("Game Over! ", canvas.clientWidth/6.5, canvas.clientHeight/2);//position our text in center
    }

    return gameOver;// this will stop execution of drawgame method
}

alert('Game masih tahap pengembangan, gunakan kiri kanan atas bawah pada keyboard untuk bermain. Capai 40 point untuk menang')
drawGame();

//add event listener to our body
document.body.addEventListener('keydown', keyDown);
