function ShieldSegment(posx, posy, s) {
    this.x = posx;
    this.y = posy;
    this.size = s;

    this.hit = false;

    this.render = function() {
        if(!this.hit) {
            fill(0, 255, 0);
            stroke(0,255,0);
            rectMode(CENTER);
            rect(this.x, this.y, this.size,this.size);
        }
    }

    this.checkHit = function(bullets, xoff, yoff) {
        if(!this.hit) {
            for(var i = bullets.length-1; i >= 0; i--) {

                if(!bullets[i].player) {
                    if((bullets[i].x >= (xoff+this.x)-this.size/2 && bullets[i].x <= (xoff+this.x)+this.size/2) && (bullets[i].y+bullets[i].h >= (yoff+this.y) - this.size/2 && bullets[i].y-bullets[i].h <= (yoff+this.y) + this.size/2)) {
                        this.hit = true;
                        bullets.splice(i, 1);
                    }
                }

            }
        }
    }
}
