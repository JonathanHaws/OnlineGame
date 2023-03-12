
const { body, move } = require('./components.js');

class Projectile {
    constructor(x, y, xv, yv) {
        body(this, x, y, 10, 10, 'idle');
        this.xv = xv; 
        this.yv = yv;
    }

    tick() {
        move(this, 1, 1);
        if(this.y > 400) { this.game.despawn(this); }
    }
}

module.exports = Projectile;