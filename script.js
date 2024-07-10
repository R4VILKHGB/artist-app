const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

let painting = false;
let color = '#000000';
let size = 5;
let shape = 'freehand';
let startX, startY;

const colorPicker = document.getElementById('colorPicker');
const sizePicker = document.getElementById('sizePicker');
const clearButton = document.getElementById('clearButton');
const saveButton = document.getElementById('saveButton');
const rectangleButton = document.getElementById('rectangleButton');
const circleButton = document.getElementById('circleButton');
const lineButton = document.getElementById('lineButton');
const starButton = document.getElementById('starButton');
const shareButton = document.getElementById('shareButton');

colorPicker.addEventListener('change', (e) => {
  color = e.target.value;
});

sizePicker.addEventListener('change', (e) => {
  size = e.target.value;
});

canvas.addEventListener('mousedown', (e) => {
  painting = true;
  startX = e.clientX - canvas.offsetLeft;
  startY = e.clientY - canvas.offsetTop;
  if (shape === 'freehand') {
    draw(e);
  }
});

canvas.addEventListener('mouseup', (e) => {
  painting = false;
  ctx.beginPath();
  if (shape !== 'freehand') {
    drawShape(e);
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (shape === 'freehand') {
    draw(e);
  }
});

clearButton.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

saveButton.addEventListener('click', () => {
  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'artwork.png';
  link.click();
});

rectangleButton.addEventListener('click', () => {
  shape = 'rectangle';
});

circleButton.addEventListener('click', () => {
  shape = 'circle';
});

lineButton.addEventListener('click', () => {
  shape = 'line';
});

starButton.addEventListener('click', () => {
  shape = 'star';
});

shareButton.addEventListener('click', () => {
  const dataURL = canvas.toDataURL('image/png');
  const shareData = {
    title: 'My Artwork',
    text: 'Check out my artwork!',
    files: [
      new File([dataURLToBlob(dataURL)], 'artwork.png', { type: 'image/png' })
    ]
  };

  navigator.share(shareData).catch(console.error);
});

function draw(e) {
  if (!painting) return;

  ctx.lineWidth = size;
  ctx.lineCap = 'round';
  ctx.strokeStyle = color;

  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

function drawShape(e) {
  const endX = e.clientX - canvas.offsetLeft;
  const endY = e.clientY - canvas.offsetTop;
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  
  switch(shape) {
    case 'rectangle':
      ctx.strokeRect(startX, startY, endX - startX, endY - startY);
      break;
    case 'circle':
      ctx.beginPath();
      ctx.arc(startX, startY, Math.hypot(endX - startX, endY - startY), 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'line':
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      break;
    case 'star':
      drawStar(startX, startY, Math.hypot(endX - startX, endY - startY) / 2, 5);
      break;
  }
}

function drawStar(cx, cy, outerRadius, points) {
  const innerRadius = outerRadius / 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < points; i++) {
    ctx.rotate(Math.PI / points);
    ctx.lineTo(cx, cy - innerRadius);
    ctx.rotate(Math.PI / points);
    ctx.lineTo(cx, cy - outerRadius);
  }
  ctx.closePath();
  ctx.stroke();
}

function dataURLToBlob(dataURL) {
  const binary = atob(dataURL.split(',')[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: 'image/png' });
}
