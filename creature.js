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
        this.angle = 0;
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
            this.targetAngle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
            this.angleInc = Math.abs(this.angle - this.targetAngle) / 40;
        }
        //Fix angles if they are out of bounds
        if(this.targetAngle > Math.PI * 2 || this.targetAngle < 0){
            this.targetAngle = floatSafeRemainder(this.targetAngle, Math.PI * 2);
        }
        if(this.angle > Math.PI * 2 || this.angle < 0){
            this.angle = floatSafeRemainder(this.angle, Math.PI * 2);
        }
        //Turn if necessary
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
            //Move
            this.velocity = {
                x: Math.cos(this.angle) * 2,
                y: Math.sin(this.angle) * 2
            };
            if(Math.abs(this.angle - this.targetAngle) < .1 && !this.isNearEdge() && this.target === null){
                console.log("Stopping")
                console.log(this.angle - this.targetAngle);
                this.angle = this.targetAngle;
            }
            //Handle targets
            else if(this.target != null){
                //Check for touching a target
                const dist = Math.hypot(this.x - this.target.x, this.y - this.target.y);
                if(dist - this.target.radius - this.radius < 1){
                    organisms.splice(organisms.indexOf(this.target), 1);
                    this.target = null;
                }
                //Turn towards targets
                else{
                    let idealAngle = Math.atan(((this.y - this.target.y) / (this.x - this.target.x)))
                    if(this.target.x < this.x){
                        idealAngle -= Math.PI;
                    }
                    if(Math.abs(this.angle - idealAngle) < .1){
                        this.angle = idealAngle;
                    }
                    else{
                        this.targetAngle = idealAngle;
                    }
                }
                
            }
            
        }
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        //Bounce off walls if required
        if(this.x - this.radius < 0 || this.x + this.radius > canvas.width){
            if(this.velocity.x < 0){
                this.angle = Math.random() * (Math.PI - Math.PI / 3) - (Math.PI / 2 - Math.PI / 6);
                this.targetAngle = this.angle;
            }
            else{
                this.angle = Math.random() * (Math.PI - Math.PI / 3) + (Math.PI / 2 + Math.PI / 6);
                this.targetAngle = this.angle;
            }
            this.velocity = {
                x: Math.cos(this.angle) * 2,
                y: Math.sin(this.angle) * 2
            };
        }
        else if(this.y - this.radius < 0 || this.y + this.radius > canvas.height){
            if(this.velocity.y < 0){
                this.angle = Math.random() * (Math.PI - Math.PI / 3) + Math.PI / 6;
                this.targetAngle = this.angle;
            }
            else{
                this.angle = Math.random() * (Math.PI - Math.PI / 3) + Math.PI + Math.PI / 6;
                this.targetAngle = this.angle;
            }
            this.velocity = {
                x: Math.cos(this.angle) * 2,
                y: Math.sin(this.angle) * 2
            };
        }
        //Smooth rotations
        
        else if(this.angle === this.targetAngle){
            if(this.x - this.radius - 50 < 0 && this.velocity.x < 0){
                this.targetAngle = Math.random() * (Math.PI - Math.PI / 3) - (Math.PI / 2 - Math.PI / 6);
            }
            else if(this.x + this.radius + 50 > canvas.width && this.velocity.x > 0){
                this.targetAngle = Math.random() * (Math.PI - Math.PI / 3) + (Math.PI / 2 + Math.PI / 6);
            }
            else if(this.y - this.radius - 50 < 0 && this.velocity.y < 0){
                this.targetAngle = Math.random() * (Math.PI - Math.PI / 3) + Math.PI / 6;
            }
            else if(this.y + this.radius + 50 > canvas.height && this.velocity.y > 0){
                this.targetAngle = Math.random() * (Math.PI - Math.PI / 3) + Math.PI + Math.PI / 6;
            }
            this.angleInc = Math.abs(this.angle - this.targetAngle) / 40;
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
function floatSafeRemainder(val, step){
    var valDecCount = (val.toString().split('.')[1] || '').length;
    var stepDecCount = (step.toString().split('.')[1] || '').length;
    var decCount = valDecCount > stepDecCount? valDecCount : stepDecCount;
    var valInt = parseInt(val.toFixed(decCount).replace('.',''));
    var stepInt = parseInt(step.toFixed(decCount).replace('.',''));
    var output = (valInt % stepInt) / Math.pow(10, decCount);
    if(val < 0){
        output += Math.PI * 2;
    }
    return output;
  }