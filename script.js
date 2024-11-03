document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.querySelector('.game-container');
    let player = document.querySelector('.player');
    const restartButton = document.getElementById('restart-button');
    let isJumping = false;
    let gravity = 0.9;
    let platforms = [];
    let powerUps = [];
    let score = 0;
    let movePlatformsInterval;

    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            gameContainer.appendChild(visual);
        }
    }

    class PowerUp {
        constructor(newPowerUpBottom) {
            this.bottom = newPowerUpBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('power-up');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            gameContainer.appendChild(visual);
        }
    }

    function createPlatforms() {
        for (let i = 0; i < 5; i++) {
            let platGap = 600 / 5;
            let newPlatBottom = 100 + i * platGap;
            let newPlatform = new Platform(newPlatBottom);
            platforms.push(newPlatform);

            if (Math.random() > 0.7) {
                let newPowerUp = new PowerUp(newPlatBottom + 15);
                powerUps.push(newPowerUp);
            }
        }
    }

    function movePlatforms() {
        if (playerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';

                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove('platform');
                    platforms.shift();
                    score++;
                    let newPlatform = new Platform(600);
                    platforms.push(newPlatform);
                }
            });

            powerUps.forEach(powerUp => {
                powerUp.bottom -= 4;
                let visual = powerUp.visual;
                visual.style.bottom = powerUp.bottom + 'px';

                if (powerUp.bottom < 10) {
                    let firstPowerUp = powerUps[0].visual;
                    firstPowerUp.classList.remove('power-up');
                    powerUps.shift();
                }
            });
        }
    }

    function jump() {
        clearInterval(downTimerId);
        isJumping = true;
        upTimerId = setInterval(function () {
            playerBottomSpace += 15;
            player.style.bottom = playerBottomSpace + 'px';
            if (playerBottomSpace > startPoint + 150) {
                fall();
            }
        }, 30);
    }

    function fall() {
        clearInterval(upTimerId);
        isJumping = false;
        downTimerId = setInterval(function () {
            playerBottomSpace -= 5 * gravity;
            player.style.bottom = playerBottomSpace + 'px';
            if (playerBottomSpace <= 0) {
                gameOver();
            }
            platforms.forEach(platform => {
                if (
                    (playerBottomSpace >= platform.bottom) &&
                    (playerBottomSpace <= platform.bottom + 15) &&
                    ((playerLeftSpace + 50) >= platform.left) &&
                    (playerLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ) {
                    startPoint = playerBottomSpace;
                    jump();
                }
            });

            powerUps.forEach(powerUp => {
                if (
                    (playerBottomSpace >= powerUp.bottom) &&
                    (playerBottomSpace <= powerUp.bottom + 15) &&
                    ((playerLeftSpace + 50) >= powerUp.left) &&
                    (playerLeftSpace <= (powerUp.left + 30))
                ) {
                    collectPowerUp(powerUp);
                }
            });
        }, 30);
    }

    function collectPowerUp(powerUp) {
        powerUp.visual.classList.remove('power-up');
        gameContainer.removeChild(powerUp.visual);
        powerUps = powerUps.filter(p => p !== powerUp);
        score += 10;
    }

    function gameOver() {
        isGameOver = true;
        clearInterval(movePlatformsInterval);
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
        while (gameContainer.firstChild) {
            gameContainer.removeChild(gameContainer.firstChild);
        }
        gameContainer.innerHTML = `Game Over! Score: ${score}`;
        restartButton.style.display = 'block';
    }

    function control(e) {
        if (e.key === "ArrowLeft") {
            moveLeft();
        } else if (e.key === "ArrowRight") {
            moveRight();
        } else if (e.key === "ArrowUp") {
            moveStraight();
        }
    }

    function moveLeft() {
        if (isGoingRight) {
            clearInterval(rightTimerId);
            isGoingRight = false;
        }
        isGoingLeft = true;
        leftTimerId = setInterval(function () {
            if (playerLeftSpace >= 0) {
                playerLeftSpace -= 5;
                player.style.left = playerLeftSpace + 'px';
            } else moveRight();
        }, 20);
    }

    function moveRight() {
        if (isGoingLeft) {
            clearInterval(leftTimerId);
            isGoingLeft = false;
        }
        isGoingRight = true;
        rightTimerId = setInterval(function () {
            if (playerLeftSpace <= 340) {
                playerLeftSpace += 5;
                player.style.left = playerLeftSpace + 'px';
            } else moveLeft();
        }, 20);
    }

    function moveStraight() {
        isGoingLeft = false;
        isGoingRight = false;
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
    }

    function start() {
        if (!isGameOver) {
            createPlatforms();
            movePlatformsInterval = setInterval(movePlatforms, 30);
            jump();
            document.addEventListener('keyup', control);
        }
    }

    function resetGame() {
        isJumping = false;
        platforms = [];
        powerUps = [];
        score = 0;
        playerBottomSpace = 150;
        startPoint = playerBottomSpace;
        playerLeftSpace = 50;
        isGameOver = false;
        clearInterval(movePlatformsInterval);
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
        gameContainer.innerHTML = '<div class="player"></div>';
        player = document.querySelector('.player');
        restartButton.style.display = 'none';
        start();
    }

    let playerBottomSpace = 150;
    let startPoint = playerBottomSpace;
    let playerLeftSpace = 50;
    let isGameOver = false;
    let upTimerId;
    let downTimerId;
    let leftTimerId;
    let rightTimerId;
    let isGoingLeft = false;
    let isGoingRight = false;

    start();

    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#000000', '#FF5733', '#FF8C00', '#FFD700', '#ADFF2F', '#00FF7F', '#00CED1', '#1E90FF', '#9370DB', '#FF1493', '#000000'];
    let colorIndex = 0;

    setInterval(() => {
        document.body.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
    }, 5000);

    restartButton.addEventListener('click', resetGame);
});