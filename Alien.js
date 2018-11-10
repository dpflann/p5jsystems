function Alien(posx, posy, s, sprite) {
    this.x = posx;
    this.y = posy;

    this.size = s;
    this.sprite = sprite;

    this.render = function() {
        imageMode(CENTER);
        image(this.sprite, this.x, this.y, this.size, this.size);
    }

    this.shoot = function(bullets, shootRate) {
        if(random() < shootRate) {
            bullets.push(new Bullet(this.x, this.y, false));
        }
    }
}
