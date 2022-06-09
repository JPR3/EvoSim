/* 
    Plans:

*/
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

let organisms = []
for(let i = 0; i < 1; i++){
    cre1 = new Creature(Math.random() * canvas.width, Math.random() * canvas.height, 10, 'white', 200, 1, 20, 25, 125, 30, 1000, 1750, 150);
    organisms.push(cre1);
}


function animate(){
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    organisms.forEach(org => {
        org.update();
    });
}
addEventListener('click', (event) => {
    plnt = new Plant(event.clientX, event.clientY, 15, 'green', 100);
    organisms.push(plnt);
})
animate();