
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