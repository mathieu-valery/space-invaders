const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results")
const buttonLeft = document.getElementById("button-left")
const buttonRight = document.getElementById("button-right")
const buttonShoot = document.getElementById("button-shoot")

let currentShooterIndex = 202;
let width = 15; //a line has 15 tiles
let direction = 1;
let invadersId;
let flashId;
let goingRight = true;
let aliensRemoved = [];
let score = 0;
const highScore = localStorage.getItem('highScore') || 0;
const highScoreBoard = document.querySelector('.highscore');

for (let i=0; i < 225; i++) {
    const tile = document.createElement("div")
    grid.appendChild(tile);
}

const tiles = Array.from(document.querySelectorAll(".grid div"));

const alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
];

function draw() {
        
    for (let i = 0; i < alienInvaders.length; i++) {
        if(!tiles[alienInvaders[i]]) {
            gameOver();
        } else if(!aliensRemoved.includes(i)) { //draw if the alien is not removed
            tiles[alienInvaders[i]].classList.add('invader');
        }
    }
}

draw();

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        tiles[alienInvaders[i]].classList.remove('invader');
    }
}

tiles[currentShooterIndex].classList.add('shooter');

function moveShooter(e) {
    tiles[currentShooterIndex].classList.remove('shooter');

    if (e.key == 'ArrowLeft' || e.target.id == 'button-left') {
        if (currentShooterIndex % width !== 0) currentShooterIndex -=1;
    } else if (e.key == 'ArrowRight' || e.target.id == 'button-right') {
        if (currentShooterIndex % width < width - 1) currentShooterIndex +=1;
    }

    tiles[currentShooterIndex].classList.add('shooter');
}

document.addEventListener('keydown', moveShooter);
buttonLeft.addEventListener('click', moveShooter);
buttonRight.addEventListener('click', moveShooter);


function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1;
    remove();

    if(rightEdge && goingRight) {
        for(let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1;
            direction = -1;
            goingRight = false;

        }
    }

    if(leftEdge && !goingRight) {
        for(let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1;
            direction = 1;
            goingRight = true;
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction;
    }

    draw()

    if (tiles[currentShooterIndex].classList.contains('invader', 'shooter')) gameOver();
    if (aliensRemoved.length === alienInvaders.length) youWin();

}

function gameOver() {
    resultDisplay.innerHTML = "GAME OVER press a key or shoot to play again"
    clearInterval(invadersId);
    tiles[currentShooterIndex].classList.add('destroyed');
    let audioExplosion = new Audio('sounds/explosion.wav');
    audioExplosion.volume = 0.05;
    audioExplosion.play();
    document.addEventListener("keydown", function(){document.location.reload()});
    buttonShoot.addEventListener('click', function(){document.location.reload()});
}

function youWin() {
    resultDisplay.innerHTML = "YOU WIN press a key or shoot to play again"
    clearInterval(invadersId);
    let audioVictory = new Audio('sounds/ff7-victory.mp3');
    audioVictory.volume = 0.1;
    audioVictory.play();
    clearInterval(flashId);
    flashId = setInterval(flash,100);
    document.addEventListener("keydown", function(){document.location.reload()});
    buttonShoot.addEventListener('click', function(){document.location.reload()});
}

function flash() {
    let victoryText = document.querySelector(".results");
    victoryText.style.color = (resultDisplay.style.color=='black') ? 'green':'black';
}

invadersId = setInterval(moveInvaders, 500);

function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
        tiles[currentLaserIndex].classList.remove('laser');
        currentLaserIndex -= width;

        if (currentLaserIndex < 0) {
            clearInterval(laserId);
            return
        }

        tiles[currentLaserIndex].classList.add('laser');

        if(tiles[currentLaserIndex].classList.contains('invader')) {
            tiles[currentLaserIndex].classList.remove('laser');
            tiles[currentLaserIndex].classList.remove('invader');
            tiles[currentLaserIndex].classList.add('boom');
            let audioInvaderKilled = new Audio('sounds/invaderkilled.wav');
            audioInvaderKilled.volume = 0.05;
            audioInvaderKilled.play();
            setTimeout(() => tiles[currentLaserIndex].classList.remove('boom'), 300);
            clearInterval(laserId);
            score ++;
            if (score > highScore) {
                localStorage.setItem('highScore', score);
                highScoreBoard.textContent = score;
            }
            resultDisplay.innerHTML = `Score: ${score}`;
            let alienRemoved = alienInvaders.indexOf(currentLaserIndex);
            aliensRemoved.push(alienRemoved);
        }
    }

    if (e.key == 's' || e.type == "click") {
        let audioShoot = new Audio('sounds/shoot.wav');
        audioShoot.volume = 0.05;
        audioShoot.play();
        laserId = setInterval(moveLaser, 100);
    }
}

document.addEventListener('keydown', shoot);

buttonShoot.addEventListener('click', shoot);

highScoreBoard.textContent = highScore;