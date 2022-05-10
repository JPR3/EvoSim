class Organism{
    constructor(x, y, radius, color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Plant extends Organism{
    constructor(x, y, radius, color){
        super(x,y,radius,color);
    }
}

class Creature extends Organism{
    constructor(x, y, radius, color){
        super(x,y,radius,color);
    }
}