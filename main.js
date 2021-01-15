const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;
const ctx = canvas.getContext("2d");

const snakeHead = new Image();
const beer = new Image();
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

let snakes = [
  new Snake(playerOne),
  new Snake(playerTwo),
  new Snake(playerThree),
  new Snake(playerFour),
];
let foods = [new Food(canvas, beer), new Food(canvas, beer)];

for (let snake of snakes) {
  snake.setContext(ctx);
  snake.setHeadImg(snakeHead);
  document.addEventListener("keydown", snake.logKey.bind(snake));
}

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

  for (let snake of snakes) {
    snake.update();
    snake.drawScore();
    snake.drawSnake();
  }

  setTimeout(() => requestAnimationFrame(() => render()), 1000 / 30);
}

render();
