const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

let painting = false;
let color = '#000000';
let size = 5;

const colorPicker = document.getElementById('colorPicker');
const sizePicker = document.getElementById('sizePicker');
const clearButton = document.getElementById('clearButton');
const saveButton = document.getElementById('saveButton');
const rectangleButton = document.getElementById('rectangleButton');
const circleButton = document.getElementById('circleButton');
const shareButton = document.getElementById('shareButton');

colorPicker.addEventListener('change', (e) => {
  color = e.target.value;
});

sizePicker.addEventListener('change', (e) => {
  size = e.target.value;
});

canvas.addEventListener('mousedown', () => {
  painting = true;
});

canvas.addEventListener('mouseup', () => {
  painting = false;
  ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);

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

let shape = 'freehand';

rectangleButton.addEventListener('click', () => {
  shape = 'rectangle';
});

circleButton.addEventListener('click', () => {
  shape = 'circle';
});

canvas.addEventListener('click', (e) => {
  if (shape === 'rectangle') {
    drawRectangle(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  } else if (shape === 'circle') {
    drawCircle(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  }
});

function drawRectangle(x, y) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 100, 50);
}

function drawCircle(x, y) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 50, 0, Math.PI * 2);
  ctx.fill();
}

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

function dataURLToBlob(dataURL) {
  const binary = atob(dataURL.split(',')[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: 'image/png' });
}
