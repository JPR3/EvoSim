/* 
    Plans:
    Speed up by calling animate again?
    Display creature attributes when clicked
    Make page work at 100% zoom lmao
        How to determine width of what page would be at 100% zoom?
        It probably won't work on other screen sizes but I'll fix it later
*/
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.querySelector('#startBtn');
const settingsEl = document.querySelector('#settingsEl');
const fSlider = document.querySelector("#fRange");
const hSlider = document.querySelector("#hRange");
const sSlider = document.querySelector("#sRange");
const pSlider = document.querySelector("#pRange");
const fDisplay = document.querySelector("#fDisplay");
const hDisplay = document.querySelector("#hDisplay");
const sDisplay = document.querySelector("#sDisplay");
const pDisplay = document.querySelector("#pDisplay");
updateScaling();
const trackedValues = ["energy", "speed", "health", "ferocity", "eThresh", "fThresh", "dThresh", "sThresh", "hThresh"];
let run = true;
let pausable = false;
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
function setup(){
    for(let i = 0; i < 100; i++){
        //x, y, radius, energy, speed, health, ferocity, eThresh, fThresh, dThresh, sThresh, hThresh, parent
        //cre1 = new Creature(Math.random() * canvas.width, Math.random() * canvas.height, 10, 200, 1.5, 20, 25, 125, 30, 1000, 1750, 150);
        cre1 = new Creature(Math.random() * canvas.width, Math.random() * canvas.height, 3 * (window.visualViewport.width / 1260), randRange(200, 25), randRange(1.5, .5), 
            randRange(20, 10), randRange(25, 5), randRange(125, 50), randRange(30, 10), randRange(1000, 200), randRange(1750, 500), randRange(150, 50));
        if(i % 4 != 3){
            pl1 = new Plant(Math.random() * (canvas.width - canvas.width / 4.5) + canvas.width / 9, Math.random() * (canvas.height - canvas.height / 4.5) + canvas.height / 9, 5 * (window.visualViewport.width / 1260), 'green');
            organisms.push(pl1);
        }
        organisms.push(cre1);
    }
}
let update = true;
let animationID
function animate(){
    animationID = requestAnimationFrame(animate);
    if(update && run){
        update = false;
        delay(1000).then(() => {
            // updateGraphs([fTotal / numCreatures, hTotal / numCreatures, sTotal / numCreatures])
            if(run){
                updateGraphs({
                    fAvg: fTotal / numCreatures,
                    hAvg: hTotal / numCreatures,
                    sAvg: sTotal / numCreatures
                })
            }
            update = true;
        });
    }
    if(run){
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        organisms.forEach(org => {
            org.update();
        });
        if(Math.trunc(Math.random() * 150) === 17){
            pl1 = new Plant(Math.random() * canvas.width, Math.random() * canvas.height, 5 * (window.visualViewport.width / 1260), 'green');
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
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
  
  
addEventListener('click', (event) => {
    if(run){
        plnt = new Plant(event.clientX, event.clientY, 5 * (window.visualViewport.width / 1260), 'green');
        organisms.push(plnt);
    }
    else{
        for(let i in organisms){
            if(organisms[i] instanceof Creature){
                let dist = Math.hypot(event.clientX - organisms[i].x, event.clientY - organisms[i].y);
                if(dist <= organisms[i].radius){
                    for(let j in trackedValues){
                        console.log(trackedValues[j] + ": " + organisms[i][trackedValues[j]]);
                    }
                }
            }
        }
    }
})
addEventListener('keydown', (event) => {
    if(event.code === "Escape"){
        cancelAnimationFrame(animationID);
        run = false;
        pausable = false;
        //Clear all values
        for(let i in organisms){
            organisms[i].kill();
        }
        organisms = [];
        numCreatures = 0;
        fTotal = 0;
        hTotal = 0;
        sTotal = 0;
        numPlants = 0;
        fCost = 0.025;
        hCost = 0.025;
        sCost = 0.025;
        pEnergy = 0;
        dataLength = 0;
        pieData = [1, 1, 1];
        createCharts();
        //Show settings menu
        settingsEl.style.display = "flex"
    }
    else if (event.code === 'Space') {
        if(pausable){
            run = !run;
        }
    }
  });

window.addEventListener('resize',function(){
    updateScaling();
},false);

startBtn.addEventListener('click', () => {
    fCost = fSlider.value / 1000;
    hCost = hSlider.value / 1000;
    sCost = sSlider.value / 1000;
    pEnergy = parseInt(pSlider.value);
    pausable = true;
    run = true;
    setup();
    animate();
    settingsEl.style.display = "none"
})
fSlider.oninput = function() {
    fDisplay.innerHTML = this.value;
}
hSlider.oninput = function() {
    hDisplay.innerHTML = this.value;
}
sSlider.oninput = function() {
    sDisplay.innerHTML = this.value;
}
pSlider.oninput = function() {
    pDisplay.innerHTML = this.value;
}
