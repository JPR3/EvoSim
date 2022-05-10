const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

cre1 = new Organism(canvas.width / 2, canvas.height / 2, 30, 'black');
cre1.draw();