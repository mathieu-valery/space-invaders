const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results")

let currentShooterIndex = 202;
let width = 15; //a line has 15 tiles
let direction = 1;
let invadersId
let goingRight = true
let aliensRemoved = []
let score = 0

for (let i=0; i < 225; i++) {
    const tile = document.createElement("div")
    grid.appendChild(tile);
}

const tiles = Array.from(document.querySelectorAll(".grid div"));

const alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

function draw() {

        for (let i = 0; i < alienInvaders.length; i++) {
            if(!aliensRemoved.includes(i)) {
                tiles[alienInvaders[i]].classList.add('invader')
            }
        }
}

draw();

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        tiles[alienInvaders[i]].classList.remove('invader')
    }
}

tiles[currentShooterIndex].classList.add('shooter');

function moveShooter(e) {
   
    tiles[currentShooterIndex].classList.remove('shooter');
    switch(e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0) currentShooterIndex -=1
            break
        case 'ArrowRight':
            if (currentShooterIndex % width < width - 1) currentShooterIndex +=1
            break
    }
    tiles[currentShooterIndex].classList.add('shooter'); 
}
document.addEventListener('keydown', moveShooter);


function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1;
    remove();

    if(rightEdge && goingRight) {
        for(let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1
            direction = -1
            goingRight = false

        }
    }

    if(leftEdge && !goingRight) {
        for(let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1
            direction = 1
            goingRight = true
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    draw()

    if (tiles[currentShooterIndex].classList.contains('invader', 'shooter')) {
        resultDisplay.innerHTML = "GAME OVER"
        clearInterval(invadersId);
    }

    for (let i= 0; i < alienInvaders.length; i++) {
        
        if(alienInvaders[i] > tiles.length) {
            resultDisplay.innerHTML = "GAME OVER"
            clearInterval(invadersId);
        }
    }

    if (aliensRemoved.length === alienInvaders.length) {
        resultDisplay.innerHTML = "YOU WIN"
        clearInterval(invadersId);
    }

    
}

invadersId = setInterval(moveInvaders, 500);

function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
        tiles[currentLaserIndex].classList.remove('laser');
        currentLaserIndex -= width
        tiles[currentLaserIndex].classList.add('laser');

        if(tiles[currentLaserIndex].classList.contains('invader')) {
            tiles[currentLaserIndex].classList.remove('laser');
            tiles[currentLaserIndex].classList.remove('invader');
            tiles[currentLaserIndex].classList.add('boom');
            let audioInvaderKilled = new Audio('sounds/invaderkilled.wav');
            audioInvaderKilled.play();
            setTimeout(() => tiles[currentLaserIndex].classList.remove('boom'), 300)
            clearInterval(laserId)
            score ++
            resultDisplay.innerHTML = score
            let alienRemoved = alienInvaders.indexOf(currentLaserIndex);
            aliensRemoved.push(alienRemoved);
       
        }
    }
    switch (e.key) {
        case 's':
            let audioShoot = new Audio('sounds/shoot.wav');
            audioShoot.play();
            laserId = setInterval(moveLaser, 100)
    }
}

document.addEventListener('keydown', shoot)