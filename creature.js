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
        //Generate a random angle
        //this.angle = Math.random() * Math.PI * 2
        this.angle = Math.PI / 4
        this.targetAngle = this.angle;
        this.angleInc = 0;
        this.velocity = {
            x: Math.cos(this.angle) * 2,
            y: Math.sin(this.angle) * 2
        };
        this.target = null;
    }
    update(){
        //Assign a new target (change to use targeting params)
        if(this.target === null && organisms.length > 1){
            let orgs = [...organisms];
            orgs.splice(orgs.indexOf(this), 1);
            const ind = Math.trunc(Math.random() * orgs.length);
            this.target = orgs[ind];
            console.log(this.target);
        }
        if(this.targetAngle < 0){
            this.targetAngle += Math.PI * 2
        }
        else if(this.targetAngle > Math.PI * 2){
            this.targetAngle -= Math.PI * 2
        }
        while(this.angle > Math.PI * 2){
            this.angle -= Math.PI * 2;
        }
        while(this.angle < 0){
            this.angle += Math.PI * 2;
        }
        //Move, and turn if necessary
        if(this.angle != this.targetAngle){
            if(this.targetAngle > this.angle){
                if(this.targetAngle - this.angle < Math.PI * 2 - (this.targetAngle - this.angle)){
                    this.angle += this.angleInc;
                }
                else{
                    this.angle -= this.angleInc;
                }
            }
            else{
                if(this.angle - this.targetAngle < Math.PI * 2 - (this.angle - this.targetAngle)){
                    this.angle -= this.angleInc;
                }
                else{
                    this.angle += this.angleInc;
                }
                
            }
            
            this.velocity = {
                x: Math.cos(this.angle) * 2,
                y: Math.sin(this.angle) * 2
            };
            if(Math.abs(this.angle - this.targetAngle) < 1 && !this.isNearEdge()){
                this.angle = this.targetAngle;
            }
        }
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        if(this.x - this.radius - 50 < 0 || this.x + this.radius + 50 > canvas.width){
            if(this.angle === this.targetAngle){
                //Generate a new target angle
                if(this.velocity.x < 0){
                    this.targetAngle = Math.random() * (Math.PI - Math.PI / 3) - (Math.PI / 2 - Math.PI / 6);
                }
                else{
                    this.targetAngle = Math.random() * (Math.PI - Math.PI / 3) + (Math.PI / 2 + Math.PI / 6);
                }
                
                this.angleInc = Math.abs(this.angle - this.targetAngle) / 40;
            }
        }
        if(this.y - this.radius - 50 < 0 || this.y + this.radius + 50 > canvas.height){
            if(this.angle === this.targetAngle){
                //Generate a new target angle
                if(this.velocity.y < 0){
                    this.targetAngle = Math.random() * (Math.PI - Math.PI / 3) + Math.PI / 6;
                }
                else{
                    this.targetAngle = Math.random() * (Math.PI - Math.PI / 3) + Math.PI + Math.PI / 6;
                }
                this.angleInc = Math.abs(this.angle - this.targetAngle) / 40;
            }
        }
        this.draw();
    }
    isNearEdge(){
        return this.y - this.radius - 50 < 0 || this.y + this.radius + 50 > canvas.height || this.x - this.radius - 50 < 0 || this.x + this.radius + 50 > canvas.width;
    }
}
function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}