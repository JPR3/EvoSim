const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

organisms = []
cre1 = new Creature(canvas.width / 2, canvas.height / 2, 10, 'white');
organisms.push(cre1);
pl1 = new Plant(canvas.width / 2 + 100, canvas.height / 2 + 100, 15, 'green');
organisms.push(pl1);

function animate(){
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    organisms.forEach(org => {
        org.update();
    });
}
animate();