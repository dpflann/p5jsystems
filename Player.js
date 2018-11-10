function Player() {
    this.size = 30;
    this.x = width/2;
    this.y = height-(20 + this.size);
    this.h = 10;
    this.lives = 3;
    this.score = 0;

    this.speed = 5;

    this.moveLeft = false;
    this.moveRight = false;

    this.gameOver = false;

    this.render = function() {
        rectMode(CENTER);

        fill(0, 255, 0);
        noStroke();
        rect(this.x, this.y, this.size, this.h);
        rect(this.x, this.y-6, 5, 5);

        for(var i = 0; i < this.lives; i++) {
            rect(this.size + i*(this.size+5), this.y+this.size, this.size, this.h);
            rect(this.size + i*(this.size+5), this.y-6+this.size, 5, 5);
        }

        fill(255);
        textAlign(LEFT, TOP);
        textSize(20);
        text('Score: ' + this.score, 0, 0);
    }

    this.update = function() {
        if(this.moveLeft) {
            this.move(-1);
        } else if(this.moveRight) {
            this.move(1);
        }

        if(this.x < 0) {
            this.x = width;
        }

        if(this.x > width) {
            this.x = 0;
        }

        if(this.lives <= 0) {
            this.gameOver = true;
        }
    }

    this.move = function(speedMult) {
        this.x += (this.speed*speedMult);
    }

    this.shoot = function() {
        shootSound.play();
        return new Bullet(this.x, this.y, true);
    }

    this.hit = function(bullets) {
        for(var i = bullets.length-1; i >= 0; i--) {
            if(!bullets[i].player) {
                if((bullets[i].x > this.x-this.size/2 && bullets[i].x < this.x+this.size/2) && (bullets[i].y > this.y-this.h/2 && bullets[i].y < this.y+this.h/2)) {
                    bullets.splice(i, 1);
                    this.lives--;
                    hitSound.play();
                }
            }
        }
    }

    this.reset = function() {
        this.size = 30;
        this.x = width/2;
        this.y = height-(20 + this.size);
        this.h = 10;
        this.lives = 3;
        this.score = 0;

        this.speed = 5;

        this.moveLeft = false;
        this.moveRight = false;

        this.gameOver = false;
    }
}
