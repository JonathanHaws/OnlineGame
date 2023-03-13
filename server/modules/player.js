
const { body, move , wrap} = require('./components.js');
const Projectile = require('./projectile.js');

class Player {
    constructor(name) {
        this.input = { x: 0, y: 0, mouseX: 0, mouseY: 0, mouseIsPressed: false };
        body(this, 640, 360, 30, 30, 'idle');
        this.name = name;
        this.reset();
    }

    reset(){
        this.health = 100;
        this.falling = 0;
        this.speed = 4;
        this.xv = 0; 
        this.yv = 0;
        this.y = -20;
        this.x = Math.floor(Math.random() * 1280);
    }

    tick() {
        if(this.health <= 0){ this.reset(); }
        wrap(this, 0, 0, this.width, 0);
        move(this, 1, .6);
        this.xv += this.input.x * this.speed;
        
        this.falling ++;
        if(this.falling < 10 && this.input.y > 0){ this.yv = -11; }
        if(this.y >= 360){ 
            this.y = 360; 
            this.falling = 0;
        }

        if(this.input.mouseIsPressed){ 
            let direction = Math.atan2(this.input.mouseY - this.y, this.input.mouseX - this.x);
            let vector = { x: Math.cos(direction), y: Math.sin(direction) };
            this.game.spawn(new Projectile(this, this.x, this.y, vector.x *20 , vector.y * 20));
        }
    }
}

module.exports = Player;