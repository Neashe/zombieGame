const gameBoard = document.querySelector('.gameBoard');
const pointsDisplay = document.querySelector('#points');
const heartsDisplay = document.querySelectorAll('.heart');
const gameBoardRect = gameBoard.getBoundingClientRect();
const startGameDisplay = document.querySelector('#start');

var points = 30;
var hearts = 3;
var gameRunning = false;
var gameLoop;

class Zombie {

    static positionChange = 200;

    constructor() {
        this.speed = Math.random()*100+50;
        this.size = Math.random()*0.5 + 0.7;
        this.position = 1800;
        this.element = document.createElement('div');
        this.element.zombieInstance = this;
        
        this.element.style.transform = `scale(${this.size})`;
        this.element.classList.add('zombie');
        gameBoard.appendChild(this.element);
        this.animate();
    }

    animate() {
        this.intervalId = setInterval(() => {
            this.element.style.backgroundPosition = `${this.position}px 0px`;
            this.element.style.right = `${parseInt(getComputedStyle(this.element).right)+this.speed/5}px`;
            this.position -=Zombie.positionChange;
            if (this.position<0){
                this.position = 1800;
            }
            if (parseInt(getComputedStyle(this.element).left) < -200){
                if (hearts > 0){
                    loseHeart();
                    if (hearts == 0){
                        gameOver();
                    }
                }
                this.destroy();
            }
        },100);
    }

    destroy() {
        clearInterval(this.intervalId);
        this.element.remove();
    }


}
function shoot(event) {
    if (points >0){
        if (event.target.classList.contains('zombie')){
            points += 10;
            event.target.zombieInstance.destroy();
        }
        else {
            points -= 3;
            points = Math.max(points,0);
        }
    updatePointsDisplay();
    }
}

function updatePointsDisplay() {
    pointsDisplay.innerText = points.toString().padStart(6,'0');  
}
function loseHeart() {
    hearts--;
    heartsDisplay[hearts].setAttribute('src','images/empty_heart.png');
}
function gameOver(){
    startGameDisplay.innerHTML = `Your score: ${points}<br><span class ='red'>Press any key</span> to restart the game`
    startGameDisplay.classList.remove('invisible');
    clearInterval(gameLoop);
    deleteZombies();
    gameRunning = false;
    gameBoard.removeEventListener('click',shoot);

}
function deleteZombies(){
    var zombies = document.querySelectorAll('.zombie');
    zombies.forEach((zombie)=>{
        zombie.remove();
    })
}
function refreshHearts(){
    heartsDisplay.forEach((heart) =>{
        heart.setAttribute('src','images/full_heart.png');
    })
}
function startGame(){
    if (!gameRunning){
    points = 30;
    hearts = 3;
    gameRunning = true;

    updatePointsDisplay();
    refreshHearts();

    gameBoard.addEventListener("click",shoot);
    startGameDisplay.classList.add('invisible');

    gameLoop = setInterval(()=>{
        new Zombie();
    },Math.random()*3000+1000)
    }

}

document.addEventListener('keypress',startGame);