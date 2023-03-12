
function body (object, x, y, width, height, image){
    object.x = x;
    object.y = y;
    object.width = width;
    object.height = height;
    object.image = image;
}

function move (object, gravity, friction){
    object.yv += gravity;
    object.xv *= friction;
    object.x += object.xv;
    object.y += object.yv;
}

function wrap (object, x, y, width, height){
    if(object.x > 1280 + width){ object.x = -width; }
    if(object.x < -width){ object.x = 1280 + width; }
}

module.exports = { body , move , wrap } ;
