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
};

function drawScore() {
    context.font = '20px Courier';
    context.fillStyle = 'black';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillText(`SCORE: ${score}`, blockSize, blockSize);   
};

function gameOver() {
    //clearInterval(intervalID);
    context.font = '60px Courier';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Game Over', width / 2, height / 2);
}

function circle(x, y, radius, fillCircle) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        context.fill();
    } else {
        context.stroke();
    }
};

/****************************************/

function Block(col, row) {
    this.col = col;
    this.row = row;
};

Block.prototype.drawSquare = function(color) {
    let x = this.col * blockSize;
    let y = this.row * blockSize;
    context.fillStyle = color;
    context.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function(color) {
    let centerX = this.col * blockSize + blockSize / 2;
    let centerY = this.row * blockSize + blockSize / 2;
    context.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
}

Block.prototype.equal = function(otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
}

/****************************************/

function Snake() {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5),
    ];

    this.direction = 'right';
    this.nextDirection = 'right';
};

Snake.prototype.draw = function() {
    for (let i = 0; i < this.segments.length; i++) {
        this.segments[i].drawSquare('blue');
    };
};

Snake.prototype.move = function() {
    let head = this.segments[0];
    let newHead;

    this.direction = this.nextDirection;

    if (this.direction === 'right') {
        newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === 'down') {
        newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === 'left') {
        newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === 'right') {
        newHead = new Block(head.col, head.row - 1);
    };

    if (this.checkCollision(newHead)) {
        gameOver();
        return;
    };

    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)) {
        score++;
        apple.move();
    } else {
        this.segments.pop()
    }
};