/* 
    Plans:
    Attribute costs
    Graphs
    Change sim attributes
    Make page work at 100% zoom lmao
*/
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const fGraph = document.getElementById("fGraph");
const hGraph = document.getElementById("hGraph");
const sGraph = document.getElementById("sGraph");
const pieGraph = document.getElementById("pieGraph");
const graphs = [fGraph, hGraph, sGraph, pieGraph];
updateScaling();

const trackedValues = ["energy", "speed", "health", "ferocity", "eThresh", "fThresh", "dThresh", "sThresh", "hThresh"];
let run = true;
function randRange(middle, deviation){
    const numStr = String(deviation);
    let multNum = 1;
    if (numStr.includes('.')) {
        multNum = numStr.split('.')[1].length * 10;
    };
    middle *= multNum;
    deviation *= multNum;
    return (Math.trunc((Math.random() * deviation * 2) + 1) + middle - deviation) / multNum
}
let organisms = []
for(let i = 0; i < 100; i++){
    //x, y, radius, energy, speed, health, ferocity, eThresh, fThresh, dThresh, sThresh, hThresh, parent
    //cre1 = new Creature(Math.random() * canvas.width, Math.random() * canvas.height, 10, 200, 1, 20, 25, 125, 30, 1000, 1750, 150);
    cre1 = new Creature(Math.random() * canvas.width, Math.random() * canvas.height, 10, randRange(200, 25), randRange(1.5, .5), 
        randRange(20, 10), randRange(25, 5), randRange(125, 50), randRange(30, 10), randRange(1000, 200), randRange(1750, 500), randRange(150, 50));
    if(i % 4 != 3){
        pl1 = new Plant(Math.random() * (canvas.width - canvas.width / 4.5) + canvas.width / 9, Math.random() * (canvas.height - canvas.height / 4.5) + canvas.height / 9, 15, 'green', 100);
        organisms.push(pl1);
    }
    organisms.push(cre1);
}
function animate(){
    requestAnimationFrame(animate);
    if(run){
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        organisms.forEach(org => {
            org.update();
        });
        if(Math.trunc(Math.random() * 150) === 17){
            pl1 = new Plant(Math.random() * canvas.width, Math.random() * canvas.height, 15, 'green', 100);
            organisms.push(pl1)
        }
    }
}
function updateScaling(){
    canvas.width = innerWidth * .8;
    canvas.height = innerHeight;
    for(let i in graphs){
        graphs[i].width = innerWidth * .2;
        graphs[i].height = innerHeight / 4;
    }
}
addEventListener('click', (event) => {
    if(run){
        plnt = new Plant(event.clientX, event.clientY, 15, 'green', 100);
        organisms.push(plnt);
    }
    else{
        for(let i in organisms){
            if(organisms[i] instanceof Creature){
                let dist = Math.hypot(event.clientX - organisms[i].x, event.clientY - organisms[i].y);
                if(dist <= organisms[i].radius){
                    console.log("Testing this out: " + organisms[i]["ferocity"])
                    for(let j in trackedValues){
                        console.log(trackedValues[j] + ": " + organisms[i][trackedValues[j]]);
                    }
                }
            }
        }
    }
})
addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        run = !run;
    }
  });

window.addEventListener('resize',function(){
    updateScaling();
},false);

animate();