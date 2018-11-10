var player;
var bullets = [];
var shields = [];
var shieldNum = 4;
var invaderCols = 10;
var invaderRows = 5;

var alienField;
var invaderSprite;

var restartButton;

Sound
var shootSound;
var move = [];
var invaderDie;
var hitSound;

function preload() {
    //I changed some of the sounds around to make it less annoying
    invaderSprite = loadImage('inv.png'); //https:news.konsolenkost.de/wp-content/uploads/2016/07/Space-medium-invader.sh-600x600.png
    shootSound = loadSound('Destroy.wav');

    for(var i = 0; i < 4; i++) {
        move[i] = loadSound((i+1)+'.wav');
    }

    invaderDie = loadSound('Fire.wav');

    hitSound = loadSound('Die.wav');
}

function setup() {
    createCanvas(700, 750);

    player = new Player();

    alienField = new AlienField(width/2, height/4, invaderRows, invaderCols, invaderSprite);
    alienField.init();

    for(var i = 0; i < shieldNum; i++) {
        shields.push(new Shield(width*0.1+(width*0.8)/(shieldNum-1)*i, height-150));
        shields[i].init();
    }

    restartButton = createButton('Restart');
    restartButton.size(100, 50);
    restartButton.position(width/2- 50, height/2+width/10);
    restartButton.mouseClicked(restart);
    restartButton.hide();
}

function draw() {
    background(0);

    if(!player.gameOver && !alienField.gameOver && !alienField.win) {
        for(var i = bullets.length-1; i >= 0; i--) {
            bullets[i].update();
            bullets[i].render();

            if(bullets[i].despawn()) {
                bullets.splice(i, 1);
            }
        }

        for(var i = 0; i < shieldNum; i++) {
            shields[i].render();
            shields[i].update(bullets);
        }

        alienField.update();
        player.score += alienField.alienHit(bullets);
        alienField.alienShoot(bullets);
        alienField.render();

        player.render();
        player.update();
        player.hit(bullets);
    } else if(!alienField.win && (player.gameOver || alienField.gameOver)) {
        textSize(width/10);
        fill(255);
        textAlign(CENTER, CENTER);
        text("Game Over!", width/2, height/2-width/10);
        text("Score: " + player.score, width/2, height/2);
        restartButton.show();
    } else if(alienField.win) {
        textSize(width/10);
        fill(255);
        textAlign(CENTER, CENTER);
        text("You Win", width/2, height/2-width/10);
        text("Score: " + player.score, width/2, height/2);
        restartButton.show();
    }
}

function restart() {
    player.reset();
    alienField.reset(width/2, height/4, invaderRows, invaderCols, invaderSprite);

    for(var i = 0; i < shieldNum; i++) {
        shields[i].reset();
    }
    restartButton.hide();
    bullets = [];
}

function keyPressed() {
    switch(key) {
        case 'a':
        case 'A':
            player.moveLeft = true;
            break;
        case 'd':
        case 'D':
            player.moveRight = true;
            break;
        case ' ':
            bullets.push(player.shoot());
            break;
    }
}

function keyReleased() {
    switch(key) {
        case 'a':
        case 'A':
            player.moveLeft = false;
            break;
        case 'd':
        case 'D':
            player.moveRight = false;
            break;
    }
}
