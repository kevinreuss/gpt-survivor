const player = document.getElementById('player');
const gameContainer = document.querySelector('.game-container');
const startHeading = document.getElementById('startHeading');
const startButton = document.getElementById('start');
const gameOverMessage = document.getElementById('gameOver');
const obstacleCountDisplay = document.getElementById('obstacleCount');
const restartButton = document.getElementById('restart');
let isJumping = false;
let gameInProgress = false;
let obstacleCount = 0;
let nextObstacleNumber = 0;
let timeouts = [];

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (gameInProgress) {
            if (!isJumping) {
                jump();
            }
        }
         else {
            restartGame()
         }
    }
});

function jump() {
    isJumping = true;
    player.style.animation = 'jump 0.5s linear';
    setTimeout(() => {
        player.style.animation = '';
        isJumping = false;
    }, 500);
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.right = '-50px';
    gameContainer.appendChild(obstacle);
    obstacleCount++;

    const obstacleText = document.createElement('span');
    obstacleText.textContent = `GPT-${obstacleCount + 3}`;
    obstacleText.style.position = 'absolute';
    obstacleText.style.top = '50%';
    obstacleText.style.left = '50%';
    obstacleText.style.transform = 'translate(-50%, -50%)';
    obstacleText.style.color = 'white';
    obstacleText.style.fontWeight = 'bold';
    obstacle.appendChild(obstacleText);

    const obstacleSpeed = 2;
    obstacle.style.animation = `moveObstacle ${obstacleSpeed}s linear infinite`;

    const checkCollision = setInterval(() => {
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        const isPlayerTouchingObstacle =
            playerRect.left < obstacleRect.right &&
            playerRect.right > obstacleRect.left &&
            playerRect.top < obstacleRect.bottom &&
            playerRect.bottom > obstacleRect.top;

        if (isPlayerTouchingObstacle) {
            gameOver();
            clearInterval(checkCollision);
        }
    }, 50);

    setTimeout(() => {
        gameContainer.removeChild(obstacle);
        nextObstacleNumber++
    }, obstacleSpeed * 1000);
    
}

function generateObstacles() {
    if (!gameInProgress) {
        return;
    }
    createObstacle();
    const interval = Math.floor(1000 + Math.random() * 1000); // Updated interval
    const timeoutId = setTimeout(generateObstacles, interval);
    timeouts.push(timeoutId);
}

function clearAllTimeouts() {
    for (const timeoutId of timeouts) {
      clearTimeout(timeoutId);
    }
    timeouts = [];
  }

function gameOver() {
    gameInProgress = false;
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach((obstacle) => {
        obstacle.style.animation = 'none';
    });
    gameOverMessage.style.display = 'block';
    obstacleCountDisplay.textContent = `You survived until GPT-${nextObstacleNumber + 4}`;
    obstacleCountDisplay.style.display = 'block';
    restartButton.style.display = 'block';

    clearAllTimeouts();
    deleteObstacles();
}

function startGame() {
    startHeading.style.display = 'none';
    startButton.style.display = 'none';
    gameInProgress = true;
    obstacleCount = 0;
    nextObstacleNumber = 0
    generateObstacles();
}

function deleteObstacles() {
    const obstacles = document.querySelectorAll(".obstacle");
    for (const obstacle of obstacles) {
      gameContainer.removeChild(obstacle);
    }
  }

function restartGame() {
    gameOverMessage.style.display = 'none';
    obstacleCountDisplay.style.display = 'none';
    restartButton.style.display = 'none';
    startGame();
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
