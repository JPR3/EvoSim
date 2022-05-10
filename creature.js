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
    update(){
        this.draw();
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
        //Generate a random angle (change later?)
        this.angle = Math.atan2(Math.random() * 2 - 1, Math.random() * 2 - 1);
        this.velocity = {
            x: Math.cos(this.angle) * 2,
            y: Math.sin(this.angle) * 2
        };
        this.target = null;
    }
    update(){
        
        if(this.target === null && organisms.length > 1){
            let orgs = [...organisms];
            orgs.splice(orgs.indexOf(this), 1);
            const ind = Math.trunc(Math.random() * orgs.length);
            this.target = orgs[ind];
            console.log(this.target);
        }
        
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        if(this.x - this.radius < 0 || this.x + this.radius > canvas.width){
            this.velocity = {
                x: -this.velocity.x,
                y: this.velocity.y
            };
        }
        if(this.y - this.radius < 0 || this.y + this.radius > canvas.height){
            this.velocity = {
                x: this.velocity.x,
                y: -this.velocity.y
            };
        }
        this.draw();
    }
}