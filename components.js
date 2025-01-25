
/**@type {HTMLCanvasElement}*/

const BirdControl = BirdManager();

function GameManage() {
    var score = 0;
    var gameOver = false;
    var highScore = 0;
    var frame = 0;

    const changeGameOver = (bool) => gameOver = bool;
    const getGameOver = () => gameOver;

    const changeHighScore = (newHighScore) => highScore = newHighScore;
    const getHighScore = () => highScore;

    const resetScore = () => score = 0;
    const getScore = () => score;
    const increaseScore = () => score++;

    const getGravity = () => gravity;
    const getGameSpeed = () => gameSpeed;
    const increaseFrame = () => frame++;
    const refreshFrame = () => frame = 0;
    const getFrame = () => frame;

    const GroundControl = GroundManager();
    const PipeControl = PipeManager();
    const coinControl = CoinsManager();
    const CloudControl = CloudManager();
    const FlowerControl = FlowerManager();
    const BackgroundControl = BackgroundManager();
    const BushControl = BushManager();

    const gameComponents = [BackgroundControl, BirdControl, GroundControl, PipeControl, coinControl, CloudControl, FlowerControl, BushControl];

    function renderComponents() {
        for (let i = 0; i < gameComponents.length; i++) {
            gameComponents[i].handle();
        }
    }


    function resetComponents() {

        PipeControl.clearPipes();
        coinControl.clearCoins();
        GameControl.resetScore();
        FlowerControl.clearFlowers();
        BushControl.clearBushes();
        GameControl.refreshFrame();
        BirdControl.BootingBird();
        CloudControl.clearClouds();
    }

    function generateStuff() {
        coinControl.addCoin();
        CloudControl.addCloud();
        FlowerControl.addFlower();
        PipeControl.generatePipe();
        BushControl.addBush();
    }

    const getComponents = () => gameComponents;

    return {
        getComponents,
        changeGameOver,
        getGameOver,
        changeHighScore,
        getHighScore,
        getScore,
        increaseScore,
        getGravity,
        getGameSpeed,
        resetScore,
        increaseFrame,
        refreshFrame,
        getFrame,
        generateStuff,
        resetComponents,
        renderComponents
    };
}

const GameControl = GameManage();

function BirdManager() {

    const Bird = {
        width: bird_width,
        height: bird_height,
        x: 50,
        y: canvas.height / 2 - bird_height / 2,
        velocityY: 0,
        jumpSpeed: 3.5,
        maxSpeed: 6,
        texture: new Image(),
        draw: function () {
            ctx.beginPath();
            ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = "gray";
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        },
        update() {
            this.velocityY += gravity;
            this.y += this.velocityY;
        }
    }

    Bird.texture.src = "resources/Assets/square_texture.png";

    function handle() {
        Bird.draw();
        Bird.update();
    }

    const BootingBird = () => {
        Bird.y = canvas.height / 2 - bird_height / 2;
        Bird.velocityY = 0;
    }

    const changeVelocity = (v) => {
        Bird.velocityY = v;
    }

    const getJumpSpeed = () => Bird.jumpSpeed;

    function checkCollideWithBird(otherComponent) {
        return collide(Bird, otherComponent);
    }

    const getY = () => Bird.y;

    function isCollectCoin(coin) {
        var DeltaX = coin.x - Math.max(Bird.x, Math.min(coin.x, Bird.x + Bird.width));
        var DeltaY = coin.y - Math.max(Bird.y, Math.min(coin.y, Bird.y + Bird.height));

        return (DeltaX * DeltaX + DeltaY * DeltaY) < (coin_radius * coin_radius);
    }

    return { handle, BootingBird, changeVelocity, getJumpSpeed, checkCollideWithBird, isCollectCoin, getY };
}

function GroundManager() {
    const groundArr = [];

    class Dirt {
        constructor(x) {
            this.x = x;
            this.y = canvas.height - ground_height;
            this.width = ground_width;
            this.height = ground_height;
            this.texture = new Image();
            this.texture.src = "resources/Assets/ground texture.png";
            this.speed = gameSpeed;
        }
        draw() {
            ctx.beginPath();
            ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);

        }
        update() {
            this.x -= this.speed;
        }
    };

    function createGround() {
        for (let x = 0; x < (canvas.width / ground_width) + 1; x++) {
            groundArr.push(new Dirt(x * ground_width));
        }
    }
    createGround();

    function handle() {
        for (let i = 0; i < groundArr.length; i++) {

            groundArr[i].draw();
            groundArr[i].update();

            if (groundArr[i].x + groundArr[i].width <= 0) {
                groundArr[i].x = canvas.width + (ground_width + groundArr[i].x);
            }

            if (BirdControl.checkCollideWithBird(groundArr[i])) {
                GameControl.changeGameOver(true);
            }
        }

    }

    const getArray = () => groundArr;

    return { handle, getArray };
}

function PipeManager() {

    var Pipes = [];

    function generatePipe() {
        var pipeTop = new PipeTop();
        var pipeBottom = new PipeBottom(pipeTop.height);
        var PipeObs = new PipeObstacle(pipeTop, pipeBottom, canvas.width, pipe_width);

        Pipes.push(PipeObs);
    }

    function handle() {
        console.log(Pipes);
        for (let i = 0; i < Pipes.length; i++) {
            Pipes[i].PipesMaintain();
            Pipes[i].update();
        }

        if (Pipes[0] && Pipes[0].xRange + Pipes[0].widthRange <= 0) {
            Pipes.splice(0, 1);
        }

        if (Pipes.length > 0 && Pipes[Pipes.length - 1].xRange + Pipes[Pipes.length - 1].widthRange <= canvas.width - PipeDistance) {
            generateGame();

        }
    }

    class Pipe {
        constructor() {
            this.texture = new Image();
            this.texture.src = "resources/Assets/bamboo texture.png";
        }
        draw() {
            ctx.beginPath();
            ctx.lineWidth = 0.25;
            ctx.strokeStyle = "black";
            ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    class PipeTop extends Pipe {
        constructor() {
            super();
            this.x = canvas.width;
            this.y = 0;
            this.width = pipe_width;
            this.height = Math.random() * (availableSpace - Pipe_gap - 15) + 15;
        }
    }

    class PipeBottom extends Pipe {
        constructor(TopPipeHeight) {
            super();
            this.x = canvas.width;
            this.y = TopPipeHeight + Pipe_gap;
            this.width = pipe_width;
            this.height = (canvas.height - this.y) - ground_height;
        }
    }

    class PipeObstacle {
        constructor(pipeTop, pipeBottom) {
            this.xRange = canvas.width;
            this.widthRange = pipe_width;
            this.TopAndBottom = [pipeTop, pipeBottom];
            this.isPassed = false;
        }
        PipesMaintain() {
            for (let i = 0; i < this.TopAndBottom.length; i++) {
                var pipe = this.TopAndBottom[i];
                pipe.draw();
                pipe.x = this.xRange;

                console.log(bird_x + bird_width > this.xRange + this.widthRange);

                if (bird_x + bird_width > this.xRange + this.widthRange && !this.passed && !BirdControl.checkCollideWithBird(pipe)) {
                    this.passed = true;
                    GameControl.increaseScore();
                }

                if (BirdControl.checkCollideWithBird(pipe)) {
                    GameControl.changeGameOver(true);
                }
            }
        }
        update() {
            this.xRange -= gameSpeed;
        }
    }

    const clearPipes = () => Pipes = [];
    const getWidth = () => pipe_width;
    const getArray = () => Pipes;

    return { generatePipe, handle, clearPipes, getWidth, getArray };
}

function CoinsManager() {
    var Coins = [];

    class Coin {
        constructor(x, y) {
            this.width = coin_radius;
            this.height = coin_radius;
            this.x = x;
            this.y = y;
        }
        draw() {
            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, coin_radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.lineWidth = 1.5;
            ctx.strokeStyle = "yellow";
            ctx.arc(this.x, this.y, coin_radius, 0, Math.PI * 2);
            ctx.stroke();

            ctx.font = "7.5px cursive";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("1", this.x, this.y);
        }
        update() {
            this.x -= gameSpeed;
        }
    }

    function handle() {
        for (let i = 0; i < Coins.length; i++) {
            Coins[i].draw();
            Coins[i].update();

            if (BirdControl.isCollectCoin(Coins[i])) {
                Coins.splice(i, 1);
                i--;
                sfx.collect_coin.play();
                GameControl.increaseScore();
            }

            if (Coins[i] && Coins[i].x + Coins[i].width < 0) {
                Coins.splice(i, 1);
                i--;
            }
        }
    }

    const clearCoins = () => Coins = [];
    const addCoin = () => {
        Coins.push(new Coin(randomInt(canvas.width + pipe_width + coin_radius * 2, PipeDistance + canvas.width - coin_radius * 2), randomInt(coin_radius * 2, availableSpace - (coin_radius * 2))));
    }

    return { handle, clearCoins, addCoin };
}

function CloudManager() {
    const clouds = [];
    var rendered_clouds = [];

    for (let i = 0; i < 4; i++) {
        var image = new Image();
        image.src = `resources/Assets/clouds/cloud-texture-${i}.png`;
        clouds.push(image);
    }


    class Cloud {
        constructor(width, height, x, y) {
            this.cloudImg = clouds[Math.floor(Math.random() * clouds.length)];
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        draw() {
            ctx.beginPath();
            ctx.drawImage(this.cloudImg, this.x, this.y, this.width, this.height);

        }
        update() {
            this.x -= gameSpeed + 0.1625;
        }
    }

    function addCloud() {
        if (Math.floor(Math.random() * 3) == Math.floor(Math.random() * 3)) {

            var width = randomInt(65, 100);
            var height = 50;
            var cloud = new Cloud(width, height, canvas.width + width, randomInt(0, 20));
            rendered_clouds.push(cloud);
        }
    }

    function handle() {
        for (let i = 0; i < rendered_clouds.length; i++) {
            rendered_clouds[i].draw();
            rendered_clouds[i].update();

            if (rendered_clouds[i] && rendered_clouds[i].x + rendered_clouds[i].width < 0) {
                rendered_clouds.splice(i, 1);
                i--;
            }
        }
    }

    var clearClouds = () => {
        if (rendered_clouds.length > 0) {
            rendered_clouds = [];
        }
    }

    return { handle, addCloud, clearClouds };
}

function FlowerManager() {
    const flowers = [];
    var rendered_flowers = [];

    for (let i = 0; i < 4; i++) {
        var image = new Image();
        image.src = `resources/Assets/flowers/flower-${i}.png`;
        flowers.push(image);
    }


    class Flower {
        constructor(width, height, x, y) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.flower = flowers[Math.floor(Math.random() * flowers.length)];
        }
        draw() {
            ctx.beginPath();
            ctx.drawImage(this.flower, this.x, this.y, this.width, this.height);

        }
        update() {
            this.x -= gameSpeed;
        }
    }

    function addFlower() {
        var width = 20;
        var height = 20;
        var x = randomInt(canvas.width + width, canvas.width + PipeDistance - width);
        var y = availableSpace - height;
        var flower = new Flower(width, height, x, y);
        rendered_flowers.push(flower);
    }

    function handle() {
        for (let i = 0; i < rendered_flowers.length; i++) {
            rendered_flowers[i].draw();
            rendered_flowers[i].update();

            if (rendered_flowers[i] && rendered_flowers[i].x + rendered_flowers[i].width < 0) {
                rendered_flowers.splice(i, 1);
                i--;
            }
        }
    }

    var clearFlowers = () => rendered_flowers = [];

    return { clearFlowers, handle, addFlower };
}

function BushManager() {
    const bushes = [];
    var rendered_bushes = [];

    for (let i = 0; i < 3; i++) {
        var image = new Image();
        image.src = `resources/Assets/bushes/bush_texture_${i}.png`;
        bushes.push(image);
    }


    class Bush {
        constructor(width, height, x, y) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.bush = bushes[Math.floor(Math.random() * bushes.length)];
        }
        draw() {
            ctx.beginPath();
            ctx.drawImage(this.bush, this.x, this.y, this.width, this.height);

        }
        update() {
            this.x -= gameSpeed;
        }
    }

    function addBush() {
        if (Math.floor(Math.random() * 3) == Math.floor(Math.random() * 3)) {
            var size = randomInt(20, 40);
            var width = size;
            var height = size;
            var x = randomInt(canvas.width + width, canvas.width + PipeDistance - width);
            var y = availableSpace - height;
            var bush = new Bush(width, height, x, y);
            rendered_bushes.push(bush);
        }
    }

    function handle() {
        for (let i = 0; i < rendered_bushes.length; i++) {
            rendered_bushes[i].draw();
            rendered_bushes[i].update();

            if (rendered_bushes[i] && rendered_bushes[i].x + rendered_bushes[i].width < 0) {
                rendered_bushes.splice(i, 1);
                i--;
            }
        }
    }

    var clearBushes = () => rendered_bushes = [];

    return { clearBushes, handle, addBush };
}

function BackgroundManager() {
    var backgroundTexture = new Image();
    backgroundTexture.src = "resources/Assets/grass texture 2.jpg";

    var backgroundCoords = [];
    var width = 25;
    var height = 25;

    for (let y = 0; y < canvas.height + 1; y += height) {
        backgroundCoords.push([]);
        for (let x = 0; x < canvas.width + 1; x += width) {
            backgroundCoords[backgroundCoords.length - 1].push({ x, y });
        }
    }

    function handle() {
        backgroundCoords.forEach(function (row) {
            for (let i = 0; i < row.length; i++) {
                ctx.beginPath();
                ctx.drawImage(backgroundTexture, row[i].x, row[i].y, width, height);
                row[i].x -= gameSpeed;
            }
        });



        if (backgroundCoords[0][0].x + width <= 0) {
            for (let i = 0; i < backgroundCoords.length; i++) {
                backgroundCoords[i].shift();
                backgroundCoords[i].push({ x: canvas.width, y: i * height });

            }
        }
    }

    return { handle };
}

function collide(rect1, rect2) {
    return rect1.x + rect1.width > rect2.x &&
        rect1.x < rect2.x + rect2.width &&
        rect1.y + rect1.height > rect2.y &&
        rect1.y < rect2.y + rect2.height
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomDecimalPoint(min, max) {
    return Math.random() * (max - min + 1) + min;
}