const canvas = document.createElement("canvas");
const changeMusicBtn = document.getElementById("ChangeMusic");
const music_control = document.getElementById("music-control");
const ctx = canvas.getContext("2d");

canvas.id = "game";
canvas.width = 550;
canvas.height = 400;
canvas.style.cursor = "pointer";

const sfx = {
    lose: new Audio("resources/SFX/lose.mp3"),
    jump: new Audio("resources/SFX/jump.mp3"),
    collect_coin: new Audio("resources/SFX/collect coin.mp3")
};

const musics = [new Audio("resources/musics/BattleTown.mp3"),
new Audio("resources/musics/Partyt-Aumlr-Igaringng.mp3"),
new Audio("resources/musics/the_race_around_the_world.mp3"),
new Audio("resources/musics/conclusion.mp3"),
new Audio("resources/musics/Lightspeed.mp3")];
for (let i = 0; i < musics.length; i++) musics[i].loop = true;

const gameSpeed = 1.5;
const gravity = 0.12;
const pipe_width = 15;
const Pipe_gap = 125;
const PipeDistance = 200;
const ground_width = 50;
const ground_height = 60;
const availableSpace = canvas.height - ground_height;
const bird_width = 20;
const bird_height = 20;
const bird_x = 50;
const coin_radius = 7.5;
var pressedUp = false;
var gradient;
var GameMusic;

function switch_control() {
    if (music_control.getAttribute("src") === "resources/Assets/played.jpg") {
        music_control.src = "resources/Assets/paused.jpg";
    } else {
        music_control.src = "resources/Assets/played.jpg";
    }
}

window.addEventListener("load", function () {
    document.getElementById("container").prepend(canvas);
    gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#ffdf00");
    gradient.addColorStop(0.5, "#fcc200");
    gradient.addColorStop(1, "gold");
    window.addEventListener("keydown", function (e) {
        if (e.code == "Enter") {
            canvas.requestFullscreen();
        }
    });
    canvas.addEventListener("click", startGame);
});
