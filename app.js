const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;
// ctx.fillStyle = "lightgreen";
// ctx.fillRect(120, 0, unit, unit);

let snake = [];
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}

class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    let overlapping = false;
    let newX;
    let newY;

    function checkOverlapping(newX, newY) {
      for (let i = 0; i < snake.length; i++) {
        if (newX == snake[i].x && newY == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      newX = Math.floor(Math.random() * column) * unit;
      newY = Math.floor(Math.random() * row) * unit;
      checkOverlapping(newX, newY);
    } while (overlapping);

    this.x = newX;
    this.y = newY;
  }
}

// initail
createSnake();
let myFruit = new Fruit();

// 蛇的方向
let d = "Right";
function changeDirection(e) {
  if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  }
  // 限制每一幀只能按一次按鍵改變方向。
  // 避免手速過快，出現奇怪的自殺現象。
  window.removeEventListener("keydown", changeDirection);
}

let highestScore;
loadHighestScore();
let score = 0;
document.getElementById("myScore").innerHTML = "遊戲分數：" + score;
document.getElementById("myScore2").innerHTML = "最高分數：" + highestScore;

function draw() {
  // 每次畫圖前，確認蛇頭沒有沒碰到身體
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("遊戲結束");
      return;
    }
  }

  // 更新canvas畫布
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  myFruit.drawFruit();

  // 蛇的移動
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white";
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  // 依d來決定蛇的座標要怎麼移用
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "Left") {
    snakeX -= unit;
    if (snakeX < 0) {
      snakeX = canvas.width - unit;
    }
  } else if (d == "Up") {
    snakeY -= unit;
    if (snakeY < 0) {
      snakeY = canvas.height - unit;
    }
  } else if (d == "Right") {
    snakeX += unit;
    if (snakeX >= canvas.width) {
      snakeX = 0;
    }
  } else if (d == "Down") {
    snakeY += unit;
    if (snakeY >= canvas.height) {
      snakeY = 0;
    }
  }
  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.pickALocation();
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "遊戲分數：" + score;
    document.getElementById("myScore2").innerHTML = "最高分數：" + highestScore;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    highestScore = score;
    localStorage.setItem("highestScore", score);
  }
}
