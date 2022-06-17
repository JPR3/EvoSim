/* 
    Plans:
    Creature interactions
    Attribute costs
    Pause and see org stats
    Graphs
    Change sim attributes
*/
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;
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
///*
let organisms = []
for(let i = 0; i < 100; i++){
    //x, y, radius, energy, speed, health, ferocity, eThresh, fThresh, dThresh, sThresh, hThresh, parent
    //cre1 = new Creature(Math.random() * canvas.width, Math.random() * canvas.height, 10, 200, 1, 20, 25, 125, 30, 1000, 1750, 150);
    cre1 = new Creature(Math.random() * canvas.width, Math.random() * canvas.height, 10, randRange(200, 25), randRange(1.5, .5), 
        randRange(20, 10), randRange(25, 5), randRange(125, 50), randRange(30, 10), randRange(1000, 200), randRange(1750, 500), randRange(150, 50));
    if(i % 2 == 0){
        pl1 = new Plant(Math.random() * (canvas.width - canvas.width / 4.5) + canvas.width / 9, Math.random() * (canvas.height - canvas.height / 4.5) + canvas.height / 9, 15, 'green', 100);
        organisms.push(pl1);
    }
    organisms.push(cre1);
}
//*/
function animate(){
    requestAnimationFrame(animate);
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
addEventListener('click', (event) => {
    plnt = new Plant(event.clientX, event.clientY, 15, 'green', 100);
    organisms.push(plnt);
})
animate();