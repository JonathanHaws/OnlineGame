
function body (object, x, y, width, height, image){
    object.x = x;
    object.y = y;
    object.width = width;
    object.height = height;
    object.image = image;
}

function move(object, gravity, friction, solidObjects) {
    function collide(){ //console.log(solidObjects);
        if(!solidObjects){ return false; }
        for (let i = 0; i < solidObjects.length; i++) {
            const solidObject = solidObjects[i];
            let solid = object.game.collideObjectType(object, solidObject);
            if (solid) { return solid; }
        }
        return false;
    }

    object.yv += gravity;
    object.xv *= friction;

    object.x += object.xv;
    let solid = collide(); 
    if(solid){ 
        if(object.xv > 0){ object.x = solid.x - object.width; }
        if(object.xv < 0){ object.x = solid.x + object.width; }
        object.xv = 0;
    } 
        
    object.y += object.yv;
    solid = collide(); ;
    if(solid){ 
        if(object.yv > 0){ object.y = solid.y - object.height; }
        if(object.yv < 0){ object.y = solid.y + object.height; }
        object.yv = 0;
    } 
}

function wrap (object, x, y, width, height){
    if(object.x > 1280 + width){ object.x = -width; }
    if(object.x < -width){ object.x = 1280 + width; }
}

module.exports = { body, move, wrap } ;
