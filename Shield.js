function Shield(posx, posy) {
    this.x = posx;
    this.y = posy;

    this.rows = 5;
    this.cols = 10;

    this.segments;
    this.segmentSize = 5;

    this.init = function() {
        this.segments = new Array(this.rows);

        for(var r = 0; r < this.rows; r++) {
            this.segments[r] = new Array(this.cols);
        }

        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                this.segments[r][c] = new ShieldSegment(c*this.segmentSize, r*this.segmentSize, this.segmentSize);
            }
        }
    }

    this.render = function() {
        push();
        translate(this.x-(this.cols*this.segmentSize)/2, this.y - (this.rows*this.segmentSize)/2);
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                this.segments[r][c].render();
            }
        }
        pop();
    }

    this.update = function(bullets) {
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                this.segments[r][c].checkHit(bullets, this.x - (this.cols*this.segmentSize)/2, this.y - (this.rows*this.segmentSize)/2);
            }
        }
    }

    this.reset = function() {
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                this.segments[r][c].hit = false;
            }
        }
    }
}
