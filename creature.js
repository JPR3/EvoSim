let numCreatures = 0;
let fTotal = 0;
let hTotal = 0;
let sTotal = 0;
let numPlants = 0;
let fCost = 0.025;
let hCost = 0.025;
let sCost = 0.025;
class Organism{
    constructor(x, y, radius, color, energy, ferocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.energy = energy;
        this.targetedBy = [];
        this.ferocity = ferocity;
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
    kill(){
        organisms.splice(organisms.indexOf(this), 1);
        this.targetedBy.forEach((other) => {
            other.target = null;
        });
    }
}

class Plant extends Organism{
    constructor(x, y, radius, color, energy, cluster){
        super(x,y,radius,color, energy, 0);
        numPlants++;
        if(cluster === undefined || cluster === null){
            this.cluster = [this]
        }
        else{
            this.cluster = cluster;
        }
        this.gSteps = 0; //Counts steps between growths
        this.cooldown = 500; //Minimum time between growths
    }
    update(){
        this.gSteps += 1;
        if(this.gSteps >= this.cooldown && this.cluster[0] === this && Math.floor(Math.random() * 100) == 1 && numPlants < 500){
            //Grow a copy of the plant tangent to the original
            this.gSteps = 0;
            const gp = this.cluster[Math.floor(Math.random() * this.cluster.length)];
            const angle = Math.random() * Math.PI * 2
            const newPl = new Plant(gp.x + (2 * gp.radius * Math.cos(angle)), gp.y + (2 * gp.radius * Math.sin(angle)),
                gp.radius, gp.color, gp.energy, gp.cluster)
            organisms.push(newPl);
            this.cluster.push(newPl);
        }
        this.draw();
    }
    kill(){
        super.kill();
        numPlants--;
        this.cluster.splice(this.cluster.indexOf(this), 1);
    }
}

class Creature extends Organism{
    constructor(x, y, radius, energy, speed, health, ferocity, eThresh, fThresh, dThresh, sThresh, hThresh, parent){
        super(x,y,radius,calcColor(speed, health, ferocity), energy, ferocity);
        //Generate a random angle
        this.angle = Math.random() * Math.PI * 2
        this.targetAngle = this.angle;
        this.angleInc = 0;
        this.velocity = {
            x: Math.cos(this.angle) * 2,
            y: Math.sin(this.angle) * 2
        };
        this.target = null;
        this.speed = speed;
        this.maxHealth = health;
        this.health = health;
        this.eThresh = eThresh; //Energy threshold for creating child
        this.fThresh = fThresh; //Ferocity threshold to avoid attacking
        this.dThresh = dThresh; //Distance threshold for possible targets
        this.hThresh = hThresh; //Threshold for when to seek target based on energy levels
        this.sThresh = sThresh; //Steps threshold of when to begin seeking reproduction
        this.steps = 0;
        this.reproducing = false;
        this.family = []
        if(parent != null){
            this.family.push(parent);
        }
        numCreatures++;
        fTotal += ferocity;
        hTotal += health;
        sTotal += speed;
    }
    findTarget(orgs){
        orgs.splice(orgs.indexOf(this), 1);
        let closest = {
            distance: this.dThresh,
            org: null
        }
        for(let i in orgs){
            let dist = Math.hypot(this.x - orgs[i].x, this.y - orgs[i].y);
            if(this.family.indexOf(orgs[i]) === -1 && (orgs[i].ferocity < this.fThresh || orgs[i] instanceof Plant) && dist < this.dThresh && dist < closest.distance){
                closest = {
                    distance: dist,
                    org: orgs[i]
                }
            }
        }
        if(closest.org === null){
            return;
        }
        this.target = closest.org;
        this.target.targetedBy.push(this);
        this.targetAngle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
        this.angleInc = Math.abs(this.angle - this.targetAngle) / 40;
        this.targetedAt = Date.now();
        
    }
    update(){
        //Reproduction
        if(this.energy >= this.eThresh * 2 && this.steps >= this.sThresh){
            this.steps = 0;
            let child;
            if(Math.trunc(Math.random() * 25) === 18){
                child = this.generateMutation();
            }
            else{
                child = new Creature(this.x, this.y, this.radius, this.hThresh, this.speed, this.maxHealth, this.ferocity, this.eThresh, this.fThresh, this.dThresh, this.sThresh, this.hThresh, this);
            }
            this.family.push(child);
            organisms.push(child);
            this.energy -= this.hThresh;
        }
        //Assign a new target
        if(this.target === null && organisms.length > 1 && (this.energy <= this.hThresh || this.steps >= this.sThresh)){
            let orgs = [...organisms];
            this.findTarget(orgs);
        }
        else if(this.target != null){
            //Check for touching a target
            const dist = Math.hypot(this.x - this.target.x, this.y - this.target.y);
            if(dist - this.target.radius - this.radius < 1){
                //Creature interactions
                if(this.target instanceof Plant || this.ferocity >= this.target.health){
                    //Attacker clean win
                    this.energy += this.target.energy;
                    this.target.kill();
                }
                else{
                    //Target injured, but no kill
                    this.target.health -= this.ferocity;
                    let orgs = [...organisms];
                    orgs.splice(orgs.indexOf(this.target), 1);
                    this.findTarget(orgs);
                }
            }
            //Check for chasing target too long
            else if(Date.now() - this.targetedAt > 10000 && organisms.length > 1){
                let orgs = [...organisms];
                orgs.splice(orgs.indexOf(this.target), 1);
                this.findTarget(orgs);
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
            //Update velocity
            this.velocity = {
                x: Math.cos(this.angle) * 2,
                y: Math.sin(this.angle) * 2
            };
            
            if(Math.abs(this.angle - this.targetAngle) < .1 && !this.isNearEdge() && this.target === null){
                this.angle = this.targetAngle;
            }
            
        }
        //Step
        this.x = this.x + this.velocity.x * (this.speed * window.visualViewport.width / 3780);
        this.y = this.y + this.velocity.y * (this.speed * window.visualViewport.width / 3780);
        this.energy -= ((fCost * (this.ferocity / 25)) + (hCost * (this.health / 20)) + (sCost * (this.speed / 1.5)))
        if(this.energy <= 0){
            this.kill();
        }
        this.steps += 1;
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
            //Rotate away from walls
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
            //Random turning around
            else if(Math.trunc(Math.random() * 175) === 42){
                this.targetAngle = Math.random() * Math.PI * 2;
            }
            this.angleInc = Math.abs(this.angle - this.targetAngle) / 40;
        }
        this.draw();
    }
    isNearEdge(){
        return this.y - this.radius - 50 < 0 || this.y + this.radius + 50 > canvas.height || this.x - this.radius - 50 < 0 || this.x + this.radius + 50 > canvas.width;
    }
    generateMutation(){
        let l_ferocity = this.ferocity;
        let l_speed = this.speed;
        let l_health = this.maxHealth;
        let l_eThresh = this.eThresh; 
        let l_fThresh = this.fThresh;
        let l_dThresh = this.dThresh; 
        let l_hThresh = this.hThresh;
        let l_sThresh = this.sThresh;
        const mainNum = Math.trunc(Math.random() * 3)
        const num = Math.trunc(Math.random() * 5)
        if(mainNum == 0){
            l_speed = randRange(this.speed, .25);
        }
        else if(mainNum == 1){
            l_health = randRange(this.maxHealth, 5);
        }
        else{
            l_ferocity = randRange(this.ferocity, 5);
        }
        switch(num) {
            case 0:
                l_eThresh = randRange(this.eThresh, 25);
                break;
            case 1:
                l_fThresh = randRange(this.fThresh, 5);
                break;
            case 2:
                l_dThresh = randRange(this.dThresh, 100);
                break;
            case 3:
                l_sThresh = randRange(this.sThresh, 250);
                break;
            case 4:
                l_hThresh = randRange(this.hThresh, 25);
                break;
            default:
                break;
        }
        return new Creature(this.x, this.y, this.radius, this.hThresh, l_speed, l_health, l_ferocity, l_eThresh, l_fThresh, l_dThresh, l_sThresh, l_hThresh, this);
    }
    kill(){
        super.kill();
        numCreatures--;
        fTotal -= this.ferocity;
        hTotal -= this.maxHealth;
        sTotal -= this.speed;
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
function calcColor(s, h, f){
    //This SHOULD, in theory, make things even in weight despite the different scales
    //Multiplies things so that their default values would all be equivalent to 150 
    s *= 100;
    h *= 7.5;
    f *= 6;
    const totalPoints = s + h + f;
    const rVal = Math.round(((totalPoints - h - s) / totalPoints) * 255);
    const gVal = Math.round(((totalPoints - f - s) / totalPoints) * 255);
    const bVal = Math.round(((totalPoints - f - h) / totalPoints) * 255);
    return "#" + ((1 << 24) + (rVal << 16) + (gVal << 8) + bVal).toString(16).slice(1);
}