
module.exports = class Game {
    constructor(tickRate, maxPlayers) {
        this.maxPlayers = maxPlayers;
        this.connectedPlayers = 0;
        this.tickRate = tickRate;
        this.objects = {};
        setInterval(()=>{ //console.log(this);
            for(let type in this.objects){
                for(let id in this.objects[type]){
                    this.objects[type][id].tick();
                }
            }    
        },1000/tickRate);
    }

    spawn(object){
        let type = object.constructor.name + 's';
        if(!this.objects[type]){ this.objects[type] = {};}
        let id = Date.now();
        object.id = id;
        object.game = this;
        return this.objects[type][id] = object;
    }

    despawn(object){
        let type = object.constructor.name + 's';
        delete this.objects[type][object.id];
        if (Object.keys(this.objects[type]).length === 0) { delete this.objects[type]; }
    }

    collideObjectType(object , type){
        if(!this.objects[type]){ return false; }
        for(let id in this.objects[type]){
            if(this.collideObjects(object, this.objects[type][id])){ return this.objects[type][id]; }
        }
        return false;
    }

    collideObjects(object1, object2) {
        return (object1.x < object2.x + object2.width &&
                object1.x + object1.width > object2.x &&
                object1.y < object2.y + object2.height &&
                object1.y + object1.height > object2.y);
    }
        
    serialized(){
        const seen = new WeakSet();
        function removeSelfRefs(key, value) {
            if (value && typeof value === 'object') {
                if (seen.has(value)) { return null; }
                seen.add(value);
            }
            return value;
        }
        return JSON.parse(JSON.stringify(this.objects, removeSelfRefs));
    }
}