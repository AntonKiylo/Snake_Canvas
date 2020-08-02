const canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    width = canvas.width,
    height = canvas.height,
    blockSize = 15,
    widthInBlocks = width / blockSize,
    heightInBlocks = height / blockSize,
    directions = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
let score = 0,
    animationTime = 100;

function drawBorder() {
    context.fillStyle = 'grey';
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
    clearTimeout(timeoutID);
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

Block.prototype.drawSquare = function (color) {
    let x = this.col * blockSize;
    let y = this.row * blockSize;
    context.fillStyle = color;
    context.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function (color) {
    let centerX = this.col * blockSize + blockSize / 2;
    let centerY = this.row * blockSize + blockSize / 2;
    context.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
}

Block.prototype.equal = function (otherBlock) {
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

Snake.prototype.draw = function () {
    for (let i = 0; i < this.segments.length; i++) {
        if (i === 0) {
            this.segments[i].drawSquare('green');
        } else if (i % 2 === 0) {
            this.segments[i].drawSquare('blue');
        } else {
            this.segments[i].drawSquare('red');
        }
    };
};

Snake.prototype.checkCollision = function(head) {
    let leftCollision = (head.col === 0);
    let topCollision = (head.row === 0);
    let rightCollision = (head.col === widthInBlocks - 1);
    let bottomCollision = (head.row === heightInBlocks - 1);

    let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
    let selfCollision = false;
    for (let i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
            selfCollision = true;
        }
    }

    return wallCollision || selfCollision;
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
    } else if (this.direction === 'up') {
        newHead = new Block(head.col, head.row - 1);
    };

    if (this.checkCollision(newHead)) {
        gameOver();
        return;
    };

    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)) {
        score++;
        animationTime--;
        apple.move();
    } else {
        this.segments.pop()
    }
};

Snake.prototype.setDirection = function(newDirection) {
    if (this.direction === 'up' && newDirection === 'down') {
        return;
    } else if (this.direction === 'right' && newDirection === 'left') {
        return;
    } else if (this.direction === 'down' && newDirection === 'up') {
        return;
    } else if (this.direction === 'left' && newDirection === 'right') {
        return;
    }
    this.nextDirection = newDirection;
};

/**********************************************/

function Apple() {
    this.position = new Block(10, 10);
};

Apple.prototype.draw = function() {
    this.position.drawCircle("green");
};

Apple.prototype.move = function () {
    let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    this.position = new Block(randomCol, randomRow);
};

/**********************************************/

let snake = new Snake();
let apple = new Apple();

function gameLoop() {
    context.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();

    setTimeout(gameLoop, animationTime)
};

let timeoutID = gameLoop()

$('body').keydown(function(event) {
    let newDirection = directions[event.keyCode];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
});