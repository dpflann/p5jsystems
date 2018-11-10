function Bullet(posx, posy, player) {
    this.x = posx;
    this.y = posy;

    this.w = 5;
    this.h = 10;

    this.speed = 8;

    this.player = player;

    this.render = function() {
        rectMode(CENTER);
        noStroke();

        if(this.player) {
            fill(0,255,0);
        } else {
            fill(255);
        }

        rect(this.x, this.y, this.w, this.h);
    }

    this.update = function() {
        if(this.player) {
            this.y -= this.speed;
        } else {
            this.y += this.speed/2 ;
        }
    }

    this.despawn = function() {
        if(this.player) {
            if(this.y < -this.h) {
                return true;
            }
        } else {
            if(this.y > height+this.h) {
                return true;
            }
        }

        return false;
    }
}
