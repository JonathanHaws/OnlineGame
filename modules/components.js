
function body(object, x, y, width, height, image){
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

module.exports = { body , move } ;
