
function playRandomMusic() {
    GameMusic = musics[Math.floor(Math.random() * musics.length)];
    GameMusic.play();
}

function changeMusic() {
    GameMusic.pause();
    GameMusic.currentTime = 0;
    var copyArr = [...musics];
    var NotAllowIndex = musics.indexOf(GameMusic);
    copyArr.splice(NotAllowIndex, 1);
    GameMusic = copyArr[Math.floor(Math.random() * copyArr.length)];
    GameMusic.play();
}

function fixMusic() {
    if (document.visibilityState == "visible") {
        if (GameMusic.paused) {
            GameMusic.play();
        }
    } else {
        if (!GameMusic.paused) {
            GameMusic.pause();
        }
    }
}

window.addEventListener("load", function () {
    welcome_screen();
});

function generateGame() {
    GameControl.generateStuff();
}

function drawScore() {
    ctx.beginPath();
    ctx.font = "20px cursive";
    ctx.textAlign = "start";
    ctx.textBaseline = "top"; 
    ctx.fillStyle = `hsl(${GameControl.getFrame() / 4},100%,50%)`; 
    ctx.fillText("Score: " + GameControl.getScore(), 5, 5);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.3;
    ctx.strokeText("Score: " + GameControl.getScore(), 5, 5);
}

function RenderGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    GameControl.renderComponents();
    drawScore();
    GameControl.increaseFrame();

    if (!GameControl.getGameOver()) requestAnimationFrame(RenderGame);
    else endGame();
}

function gameoverScreen() {
    drawGameover();
    drawHighScore();
    startText(18, "(click to start a new game)");
}

function startText(px, text) {
    ctx.beginPath();
    ctx.font = `${px}px cursive`; 
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "lightgray"; 
    ctx.fillText(text, canvas.width / 2, canvas.height / 2); 
}

function drawGameover() {
    ctx.beginPath();
    ctx.font = "55px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "hanging";
    ctx.fillStyle = "red"; 
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 70);

    ctx.lineWidth = 0.75;
    ctx.strokeText("Game Over", canvas.width / 2, canvas.height / 2 - 70);
}

function drawHighScore() {
    ctx.beginPath();
    ctx.font = "20px cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "gold";
    ctx.fillText("High Score: " + GameControl.getHighScore(), canvas.width / 2, canvas.height / 2 + 40);
}

function drawTitle() {
    ctx.beginPath();
    ctx.font = "40px cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "hanging";
    ctx.fillStyle = "#40ff53";
    ctx.fillText("Jumping Square", canvas.width / 2, canvas.height / 2 - 100);
}

function welcome_screen() {
    drawTitle();
    startText(30, "click to start");
}

function endGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    GameMusic.pause();
    GameMusic.currentTime = 0;

    if (!sfx.jump.paused) {
        sfx.jump.currentTime = 0;
        sfx.jump.pause();
    }
    sfx.lose.play();
    canvas.style.cursor = "pointer";
    changeMusicBtn.disabled = true;

    if (GameControl.getScore() > GameControl.getHighScore()) {
        GameControl.changeHighScore(GameControl.getScore());
    }

    gameoverScreen();
    GameControl.resetComponents();

    gameOverKeys();
}
