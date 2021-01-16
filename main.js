const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;
const ctx = canvas.getContext("2d");

const snakeHead = new Image();
const beer = new Image();
const grave = new Image();
grave.src = "./assets/grave.png";
beer.src = "./assets/beer.png";
snakeHead.src = "./assets/head.png";

import Food from "./game/Food.js";
import Snake from "./game/Snake.js";

let playerOne = {
  name: "Player One",
  keys: ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"],
  color: "green",
  scorePosX: 50,
  scorePosY: 20,
};

let playerTwo = {
  name: "Player Two",
  keys: ["KeyW", "KeyS", "KeyA", "KeyD"],
  x: 60,
  color: "blue",
  scorePosX: canvas.width - 100,
  scorePosY: 20,
};

let playerThree = {
  name: "Player Three",
  keys: ["KeyI", "KeyK", "KeyJ", "KeyL"],
  x: 120,
  color: "red",
  scorePosX: canvas.width - 100,
  scorePosY: canvas.height - 20,
};

let playerFour = {
  name: "Player Four",
  keys: ["Numpad8", "Numpad5", "Numpad4", "Numpad6"],
  x: 180,
  color: "yellow",
  scorePosX: 50,
  scorePosY: canvas.height - 20,
};

let snakes = [new Snake(playerOne), new Snake(playerTwo)];

function generateFood(count) {
  let food = [];
  for (let i = 0; i < count; i++) {
    food.push(new Food(canvas, beer));
  }
  return food;
}

let foods = generateFood(100);

for (let snake of snakes) {
  snake.setContext(ctx);
  snake.setHeadImg(snakeHead);
  snake.setGraveImg(grave);
  document.addEventListener("keydown", snake.logKey.bind(snake));
}

let controller = {};
let buttonsPressed = [];
function gamepadHandler(e) {
  controller = e.gamepad;
  console.log(controller);
}

window.addEventListener("gamepadconnected", gamepadHandler);

function gamepadUpdateHandler() {
  buttonsPressed = [];
  if (controller.buttons) {
    for (var b = 0; b < controller.buttons.length; b++) {
      if (controller.buttons[b].pressed) {
        buttonsPressed.push(b);
        console.log(b);
      }
    }
  }
}

function gamepadButtonPressedHandler(button) {
  var press = false;
  for (var i = 0; i < buttonsPressed.length; i++) {
    if (buttonsPressed[i] == button) {
      press = true;
    }
  }
  return press;
}

function gamePadControlSnake(entity) {
  if (gamepadButtonPressedHandler(0)) {
    //if (this.direction === "bottom") return;
    entity.direction = "top";
  } else if (gamepadButtonPressedHandler(1)) {
    //if (this.direction === "top") return;
    entity.direction = "bottom";
  }
  if (gamepadButtonPressedHandler(2)) {
    //if (this.direction === "right") return;
    entity.direction = "left";
  } else if (gamepadButtonPressedHandler(3)) {
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

let mouseX;
let mouseY;

canvas.addEventListener("mousemove", function (event) {
  mouseX = event.offsetX;
  mouseY = event.offsetY;
});

let gameState = "menu";
let currentSelection = 0;
let cnt = snakes.length;

document.addEventListener("keydown", function (e) {
  if (e.code === "ArrowDown") currentSelection++;
  else if (e.code === "ArrowUp") currentSelection--;
  if (currentSelection > 2) currentSelection = 0;
  else if (currentSelection < 0) currentSelection = 2;
  if (
    currentSelection == 0 &&
    (e.code === "Enter" || gamepadButtonPressedHandler(11))
  )
    gameState = "game";
  else if (e.code === "Escape") gameState = "menu";
  else if (e.code === "Digit1") {
    snakes.push(new Snake(playerThree));
    snakes[cnt].setContext(ctx);
    snakes[cnt].setHeadImg(snakeHead);
    cnt++;
  }
});

function drawMenu() {
  let arr = ["Start Game", "High Scores", "Settings"];
  ctx.fillStyle = "green";
  ctx.font = "48px serif";
  for (let i = 0; i < arr.length; i++) {
    if (i === currentSelection) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = "green";
    }
    ctx.fillText(arr[i], canvas.width / 2 - 96, canvas.height / 2 + 60 * i);
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (gameState === "menu") {
    drawMenu();
  } else {
    if (
      snakes[0].isEntitiesCollide(snakes[1]) ||
      snakes[1].isEntitiesCollide(snakes[0])
    ) {
      drawGameOver(snakes[0], snakes[1]);
      return;
    }

    for (let food of foods) {
      food.drawFood(ctx);
      food.eatFood(snakes);
    }

    for (let snake of snakes) {
      snake.update();
      snake.drawScore();
      snake.drawSnake();
    }
  }

  gamepadUpdateHandler();
  gamePadControlSnake(snakes[0]);
  setTimeout(() => requestAnimationFrame(() => render()), 1000 / 30);
}

render();
