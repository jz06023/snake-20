// 获取 DOM 元素
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const gameScreen = document.getElementById('game-screen');
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');

// 游戏参数
const boardWidth = 400;
const boardHeight = 400;
const blockSize = 20;
const rows = boardHeight / blockSize;
const cols = boardWidth / blockSize;
let snake = [
    { x: 5, y: 5 }
];
let direction = 'right';
let food = {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows)
};
let score = 0;
let gameInterval;

// 设置画布大小
gameBoard.width = boardWidth;
gameBoard.height = boardHeight;
const ctx = gameBoard.getContext('2d');

// 开始游戏
startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    gameInterval = setInterval(gameLoop, 100);
});

// 游戏循环
function gameLoop() {
    // 清除画布
    ctx.clearRect(0, 0, boardWidth, boardHeight);

    // 移动蛇
    moveSnake();

    // 检查碰撞
    if (checkCollision()) {
        clearInterval(gameInterval);
        alert('游戏结束！得分: ' + score);
        location.reload();
    }

    // 检查是否吃到食物
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score++;
        scoreElement.textContent = score;
        createFood();
    } else {
        snake.pop();
    }

    // 绘制蛇
    drawSnake();

    // 绘制食物
    drawFood();
}

// 移动蛇
function moveSnake() {
    let head = { ...snake[0] };
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    snake.unshift(head);
}

// 检查碰撞
function checkCollision() {
    const head = snake[0];
    // 检查是否撞到墙壁
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        return true;
    }
    // 检查是否撞到自己
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// 创建食物
function createFood() {
    food = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows)
    };
    // 确保食物不会出现在蛇的身上
    for (let i = 0; i < snake.length; i++) {
        if (food.x === snake[i].x && food.y === snake[i].y) {
            createFood();
            break;
        }
    }
}

// 绘制蛇
function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(block => {
        ctx.fillRect(block.x * blockSize, block.y * blockSize, blockSize, blockSize);
    });
}

// 绘制食物
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * blockSize, food.y * blockSize, blockSize, blockSize);
}

// 处理键盘事件
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// 处理触摸事件（手机操作）
let touchStartX = 0;
let touchStartY = 0;

gameBoard.addEventListener('touchstart', function (event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

gameBoard.addEventListener('touchend', function (event) {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && direction !== 'left') {
            direction = 'right';
        } else if (dx < 0 && direction !== 'right') {
            direction = 'left';
        }
    } else {
        if (dy > 0 && direction !== 'up') {
            direction = 'down';
        } else if (dy < 0 && direction !== 'down') {
            direction = 'up';
        }
    }
});