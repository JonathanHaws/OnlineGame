
const { body, move } = require('./components.js');
const Projectile = require('./projectile.js');

class Player {
    constructor(name) {
        this.name = name;
        this.input = { x: 0, y: 0, mouseX: 0, mouseY: 0, mouseIsPressed: false };
        body(this, 640, 360, 30, 30, 'idle');
        this.falling = 0;
        this.speed = 4;
        this.xv = 0; 
        this.yv = 0;
    }

    tick() {
        move(this, 1, .6);
        this.xv += this.input.x * this.speed;
        
        this.falling ++;
        if(this.falling < 10 && this.input.y > 0){ this.yv = -11; }
        if(this.y >= 360){ 
            this.y = 360; 
            this.falling = 0;
        }
         
        let direction = Math.atan2(this.input.mouseY - this.y, this.input.mouseX - this.x);
        let vector = { x: Math.cos(direction), y: Math.sin(direction) };
        if(this.input.mouseIsPressed){ 
            this.game.spawn(new Projectile(this.x, this.y, vector.x *20 , vector.y * 20));
        }
    }
}

module.exports = Player;