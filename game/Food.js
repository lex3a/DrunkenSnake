import { random } from "./utils.js";

export default class Food {
  constructor(canvas, img, width = 10, height = 10) {
    this.renderWidth = canvas.width;
    this.renderHeight = canvas.height;
    this.img = img;
    this.generateFood();
    this.width = width;
    this.height = height;
  }

  generateFood() {
    this.x = random(1, this.renderWidth - 10);
    this.y = random(1, this.renderHeight - 10);
  }

  drawFood(ctx) {
    ctx.fillStyle = "red";
    ctx.drawImage(
      this.img,
      0,
      0,
      10,
      10,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  foodCollision(entity) {
    const head = { x: entity.snake[0].x, y: entity.snake[0].y };
    if (
      ((head.x >= this.x && head.x <= this.x + 10) ||
        (head.x + 10 >= this.x && head.x + 10 <= this.x + 10)) &&
      ((head.y >= this.y && head.y <= this.y + 10) ||
        (head.y + 10 >= this.y && head.y + 10 <= this.y + 10))
    ) {
      return 1;
    }
    return 0;
  }

  eatFood(entites) {
    for (let entity of entites) {
      if (this.foodCollision(entity)) {
        playSound(830.6, "sine");
        this.generateFood();
        entity.snake.push({ x: 10, y: 0 });
        entity.score++;
      }
    }
  }
}
