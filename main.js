const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;
const ctx = canvas.getContext("2d");

const snakeHead = new Image();
const beer = new Image();
beer.src = "./assets/beer.png";
snakeHead.src = "./assets/head.png";

import { playSound, random } from "./game/utils.js";
import Food from "./game/Food.js";

let keysPlayerOne = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
let keysPlayerTwo = ["KeyW", "KeyS", "KeyA", "KeyD"];

class Snake {
  constructor(name = "Default", keys, x = 0, y = 0, color = this.randomColor) {
    this.keys = keys;
    this.x = x;
    this.y = y;
    this.color = color;
    this.direction = "bottom";
    this.width = 10;
    this.score = 0;
    this.height = 10;
    this.name = name;
    this.fpsInterval = 5;
    this.displayGameOver = true;
    this.snake = [
      { x: 200 + this.x, y: 50 },
      { x: 190 + this.x, y: 50 },
      { x: 180 + this.x, y: 50 },
      { x: 170 + this.x, y: 50 },
    ];
    this.food = [];
  }

  logKey(e) {
    switch (e.code) {
      case this.keys[0]:
        if (this.direction === "bottom") return;
        this.direction = "top";
        break;
      case this.keys[1]:
        if (this.direction === "top") return;
        this.direction = "bottom";
        break;
      case this.keys[2]:
        if (this.direction === "right") return;
        this.direction = "left";
        break;
      case this.keys[3]:
        if (this.direction === "left") return;
        this.direction = "right";
        break;
      default:
        console.log("No direction", e.code);
        break;
    }
  }

  generateFood() {
    if (!this.food[0] && !this.food[1]) {
      this.food[0] = random(1, canvas.width - 1);
      this.food[1] = random(1, canvas.height - 1);
    }
  }

  eatFood() {
    if (this.foodCollision()) {
      playSound(830.6, "sine");
      this.food[0] = null;
      this.food[1] = null;
      this.snake.push({ x: this.x + 10, y: 0 });
      this.fpsInterval += 2;
      this.score++;
    }
  }

  drawFood() {
    ctx.fillStyle = "red";
    ctx.drawImage(
      beer,
      0,
      0,
      10,
      10,
      this.food[0],
      this.food[1],
      this.width,
      this.height
    );
  }

  foodCollision() {
    if (
      ((this.snake[0].x >= this.food[0] &&
        this.snake[0].x <= this.food[0] + this.width) ||
        (this.snake[0].x + this.width >= this.food[0] &&
          this.snake[0].x + this.width <= this.food[0] + this.width)) &&
      ((this.snake[0].y >= this.food[1] &&
        this.snake[0].y <= this.food[1] + this.height) ||
        (this.snake[0].y + this.height >= this.food[1] &&
          this.snake[0].y + this.height <= this.food[1] + this.height))
    ) {
      return 1;
    }
    return 0;
  }

  drawSnake(color) {
    let headImgPos = 0;
    ctx.fillStyle = color;
    for (let i = 0; i < this.snake.length; i++) {
      ctx.fillRect(this.snake[i].x, this.snake[i].y, this.width, this.height);
    }
    switch (this.direction) {
      case "top":
        headImgPos = 0;
        break;
      case "right":
        headImgPos = 10;
        break;
      case "bottom":
        headImgPos = 20;
        break;
      case "left":
        headImgPos = 30;
        break;
    }
    ctx.drawImage(
      snakeHead,
      headImgPos,
      0,
      10,
      10,
      this.snake[0].x + 3,
      this.snake[0].y,
      this.width,
      this.height
    );
  }

  move() {
    const head = { x: this.snake[0].x, y: this.snake[0].y };
    switch (this.direction) {
      case "bottom":
        head.y += 10;
        break;
      case "right":
        head.x += 10;
        break;
      case "left":
        head.x -= 10;
        break;
      case "top":
        head.y -= 10;
        break;
    }
    this.snake.unshift(head);
    this.snake.pop();
  }

  isSnakeOutsideCanvas() {
    if (this.snake[0].x >= canvas.width) {
      this.snake[0].x = 0;
    } else if (this.snake[0].x < 0) {
      this.snake[0].x = canvas.width - 1;
    } else if (this.snake[0].y >= canvas.height) {
      this.snake[0].y = 0;
    } else if (this.snake[0].y < 0) {
      this.snake[0].y = canvas.height;
    }
  }

  isGameOver() {
    for (let i = 4; i < this.snake.length; i++) {
      const hasCollided =
        this.snake[i].x === this.snake[0].x &&
        this.snake[i].y === this.snake[0].y;
      if (hasCollided) return true;
    }
  }

  isEntitiesCollide(entity) {
    for (let i = 0; i < entity.snake.length; i++) {
      if (
        ((this.snake[0].x >= entity.snake[i].x &&
          this.snake[0].x <= entity.snake[i].x + this.width) ||
          (this.snake[0].x + this.width >= entity.snake[i].x &&
            this.snake[0].x + this.width <= entity.snake[i].x + this.width)) &&
        ((this.snake[0].y >= entity.snake[i].y &&
          this.snake[0].y <= entity.snake[i].y + this.height) ||
          (this.snake[0].y + this.height >= entity.snake[i].y &&
            this.snake[0].y + this.height <= entity.snake[i].y + this.height))
      )
        return true;
    }
  }

  drawScore(x, y) {
    ctx.font = "12px 'Press Start 2P'";
    ctx.fillText(`Beer: ${this.score}`, x, y);
  }

  drawGameOver(toggle) {
    if (toggle) {
      ctx.font = "48px serif";
      ctx.fillText(
        `${this.name} died!`,
        canvas.width / 2 - 96,
        canvas.height / 2
      );
      ctx.fillText(
        `Score: ${this.score}`,
        canvas.width / 2 - 48,
        canvas.height / 2 - 48
      );
    }
  }

  update() {
    if (!this.isGameOver()) {
      this.isSnakeOutsideCanvas();
      this.move();
    } else {
      this.drawGameOver(this.displayGameOver);
      setTimeout(() => {
        this.displayGameOver = false;
      }, 4500);
    }
  }
}

// let snake = new Snake("Player 1");
// let snakeTwo = new Snake("Player 2", 60);
let snakes = [
  new Snake("Player 1", keysPlayerOne),
  new Snake("Player 2", keysPlayerTwo, 60),
];
let foods = [new Food(canvas, beer), new Food(canvas, beer)];
// let food = new Food();
// let foodTwo = new Food();

document.addEventListener("keydown", snakes[0].logKey.bind(snakes[0]));
document.addEventListener("keydown", snakes[1].logKey.bind(snakes[1]));

let gp;

function buttonPressed(b) {
  if (typeof b == "object") {
    return b.pressed;
  }
  return b == 1.0;
}

window.addEventListener("gamepadconnected", function (e) {
  gp = navigator.getGamepads()[e.gamepad.index];
  console.log(
    "Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index,
    e.gamepad.id,
    e.gamepad.buttons.length,
    e.gamepad.axes.length
  );
});

function gamePadControlSnake(entity, gp) {
  if (buttonPressed(gp.buttons[0])) {
    //if (this.direction === "bottom") return;
    entity.direction = "top";
  } else if (buttonPressed(gp.buttons[2])) {
    //if (this.direction === "top") return;
    entity.direction = "bottom";
  }
  if (buttonPressed(gp.buttons[1])) {
    //if (this.direction === "right") return;
    entity.direction = "left";
  } else if (buttonPressed(gp.buttons[3])) {
    //if (this.direction === "left") return;
    entity.direction = "right";
  }
}

function drawGameOver(entity1, entity2) {
  let score = entity1.score + entity2.score;
  ctx.font = "48px serif";
  ctx.fillText(`Game Over!`, canvas.width / 2 - 96, canvas.height / 2);
  ctx.fillText(
    `Score: ${score}`,
    canvas.width / 2 - 48,
    canvas.height / 2 - 48
  );
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (
    snakes[0].isEntitiesCollide(snakes[1]) ||
    snakes[1].isEntitiesCollide(snakes[0])
  ) {
    drawGameOver(snakes[0], snakes[1]);
    return;
  }
  if (gp) {
    gamePadControlSnake(snakes[0], gp);
  }
  for (let food of foods) {
    food.drawFood(ctx);
    food.eatFood(snakes);
  }
  snakes[0].update();
  snakes[0].drawScore(50, 20);
  snakes[0].drawSnake("green");
  snakes[1].update();
  snakes[1].drawScore(canvas.width - 100, 20);
  snakes[1].drawSnake("blue");
  setTimeout(() => requestAnimationFrame(() => render()), 1000 / 30);
}

render();
