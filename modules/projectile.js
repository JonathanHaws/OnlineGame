
const { body, move, wrap } = require('./components.js');

class Projectile {
    constructor(origin, x, y, xv, yv , knockbackX, knockbackY) {
        body(this, x, y, 14, 14, 'idle');
        this.origin = origin;
        this.xv = xv; 
        this.yv = yv;
        this.knockbackX = knockbackX;
        this.knockbackY = knockbackY;
    }

    tick() {
        wrap(this, 0, 0, this.width, 0);
        move(this, 1, 1);
        if(this.y > 400) { this.game.despawn(this); }

        let player = this.game.collideObjectType(this,'Players');
        if(player && player != this.origin){
            player.health -= 2;  
            //player.xv = this.x > player.x ? this.knockbackX : -this.knockbackX;
            //player.yv = this.knockbackY;    
        }
    }
}

module.exports = Projectile;