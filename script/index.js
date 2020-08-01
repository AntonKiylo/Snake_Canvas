const canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    width = canvas.width,
    height = canvas.height,
    blockSize = 10,
    widthInBlocks = width / blockSize,
    heightInBlocks = height / blockSize;
let score = 0;

function drawBorder() {
    context.fillStyle='grey';
    context.fillRect(0, 0, width, blockSize);
    context.fillRect(0, height - blockSize, width, blockSize);
    context.fillRect(0, 0, blockSize, height);
    context.fillRect(width - blockSize, 0, blockSize, height);
}