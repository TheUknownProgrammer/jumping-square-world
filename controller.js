

function keys(e) {
    if ((e.code == "ArrowUp" || e.code == "Space") && BirdControl.getY() > 15) {
        pressedUp = true;
        BirdControl.changeVelocity(-BirdControl.getJumpSpeed());
        if (!sfx.jump.paused) {
            sfx.jump.currentTime = 0;
        }
        sfx.jump.play();
        window.removeEventListener("keydown", keys);
    }
    if (e.code == "KeyC") {
        changeMusic();
    }
}

function clickJump() {
    if (BirdControl.getY() > 15) {
        pressedUp = true;
        BirdControl.changeVelocity(-BirdControl.getJumpSpeed());
        if (!sfx.jump.paused) {
            sfx.jump.currentTime = 0;
        }
        sfx.jump.play();
    }
}

function release() {
    window.addEventListener("keydown", keys);
    pressedUp = false;
}

function startGame() {
    canvas.removeEventListener("click", startGame);
    canvas.requestPointerLock();
    canvas.style.cursor = "none";

    if (GameControl.getGameOver()) {
        GameControl.changeGameOver(false);
    }

    generateGame();

    if (!sfx.lose.paused) {
        sfx.lose.currentTime = 0;
        sfx.lose.pause();
    }

    playRandomMusic();

    document.addEventListener("visibilitychange", fixMusic);
    window.addEventListener("keydown", keys); 
    window.addEventListener("keyup", release);
    canvas.addEventListener("mousedown", clickJump);
    changeMusicBtn.addEventListener("click", changeMusic);
    changeMusicBtn.disabled = false;
    requestAnimationFrame(RenderGame);
}

function gameOverKeys() {
    document.removeEventListener("visibilitychange", fixMusic);
    window.removeEventListener("keydown", keys);
    window.removeEventListener("keyup", release);
    canvas.removeEventListener("mousedown", clickJump);
    changeMusicBtn.removeEventListener("click", changeMusic);
    canvas.addEventListener("click", startGame);
}