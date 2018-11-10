function AlienField(posx, posy, ro, co, sprite) {
    this.x = posx;
    this.y = posy;

    this.rows = ro;
    this.cols = co;

    this.xSpeed = 1;
    this.speedIncrease = 0.05;

    this.alienShootRate = 0.001;
    this.shootRate;

    this.aliens;
    this.alienSize = 30;
    this.alienSpacing = 1.3;
    this.sprite = sprite;

    this.gameOver = false;

    this.dead = 0;
    this.win = false;

    //sound
    this.playIndex = 0;
    this.playTime = 0;

    this.init = function() {
        this.aliens = new Array(this.rows);

        for(var r = 0; r < this.rows; r++) {
            this.aliens[r] = new Array(this.cols);
        }

        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {;
                this.aliens[r][c] = new Alien(this.x-(this.cols*(this.alienSize*this.alienSpacing))/2 + (this.alienSize*this.alienSpacing)*c, this.y-(this.rows*(this.alienSize*this.alienSpacing))/2 + (this.alienSize*this.alienSpacing)*r, this.alienSize, this.sprite);
            }
        }

        this.shootRate = this.alienShootRate/(this.rows*this.cols);
    }

    this.render = function() {
        for(var r = 0; r < this.aliens.length; r++) {
            for(var c = 0; c < this.aliens[r].length; c++) {
                this.aliens[r][c].render();
            }
        }
    }

    this.update = function() {
        var edge = false;

        this.shootRate = this.alienShootRate/(this.rows*this.cols-this.dead);
        if(this.dead == this.rows*this.cols) {
            this.win = true;
        }

        for(var r = 0; r < this.aliens.length; r++) {
            for(var c = 0; c < this.aliens[r].length; c++) {
                this.aliens[r][c].x += this.xSpeed;

                if(this.aliens[r][c].y + this.aliens[r][c].size > height - player.size*2 && !this.aliens[r][c].hit) {
                    this.gameOver = true;
                }

                if((this.aliens[r][c].x + this.aliens[r][c].size > width || this.aliens[r][c].x - this.aliens[r][c].size < 0) && !this.aliens[r][c].hit) {
                    edge = true;
                }
            }
        }

        if (edge) {
            for(var r = 0; r < this.aliens.length; r++) {
                for(var c = 0; c < this.aliens[r].length; c++) {
                    this.aliens[r][c].y += this.alienSize;
                }
            }
            this.xSpeed *= -1;
            this.y += this.alienSize
        }
        this.x += this.xSpeed;
        this.playTime += abs(this.xSpeed);

        if(this.playTime >=50) {
            this.playTime = 0;
            move[this.playIndex].play();
            this.playIndex += 1;

            if(this.playIndex > move.length-1) {
                this.playIndex = 0;  
            }
        }
    }

    this.alienShoot = function(bullets) {
        for(var r = 0; r < this.aliens.length; r++) {
            for(var c = 0; c < this.aliens[r].length; c++) {
                if(!this.aliens[r][c].hit) {
                    this.aliens[r][c].shoot(bullets, this.alienShootRate);
                }
            }
        }
    }

    this.alienHit = function(bullets) {

        for(var r = this.aliens.length-1; r >= 0; r--) {
            for(var c = this.aliens[r].length-1; c >= 0; c--) {

                for(var i = bullets.length-1; i >= 0; i--) {
                    if(bullets[i].player) {

                        if((bullets[i].x+bullets[i].w/2 >= this.aliens[r][c].x-this.aliens[r][c].size/2 && bullets[i].x-bullets[i].w/2 <= this.aliens[r][c].x+this.aliens[r][c].size/2) && (bullets[i].y+bullets[i].h/2 <= this.aliens[r][c].y+this.aliens[r][c].size/2 && bullets[i].y-bullets[i].h/2 >= this.aliens[r][c].y-this.aliens[r][c].size/2)) {
                            this.aliens[r].splice(c,1);
                            invaderDie.play();
                            this.dead++;
                            if(this.xSpeed < 0) {
                                this.xSpeed -= this.speedIncrease;
                            } else {
                                this.xSpeed += this.speedIncrease;
                            }
                            bullets.splice(i,1);
                            return 10;
                        }

                    }

                }

            }
        }
        return 0;
    }

    this.reset = function(posx, posy, ro, co, sprite) {
        this.x = posx;
        this.y = posy;

        this.rows = ro;
        this.cols = co;

        this.xSpeed = 1;

        this.aliens;
        this.alienSize = 30;
        this.sprite = sprite;

        this.gameOver = false;

        this.dead = 0;
        this.win = false;

        this.playIndex = 0;
        this.playTime = 0;

        this.init();
    }
}
