import { getRandomColor } from "./utils.js";

export default class Snake {
  constructor({
    name = "Default",
    keys,
    x = 0,
    y = 0,
    color = getRandomColor(),
    scorePosX,
    scorePosY,
  }) {
    this.keys = keys;
    this.x = x;
    this.y = y;
    this.alive = true;
    this.scorePosX = scorePosX;
    this.scorePosY = scorePosY;
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
  }

  setContext(ctx) {
    this.ctx = ctx;
  }

  setHeadImg(img) {
    this.headImg = img;
  }

  setGraveImg(img) {
    this.graveImg = img;
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

  drawSnake() {
    let headImgPos = 0;
    let headOffsetX = 0;
    let headOffsetY = 0;
    if (this.alive) {
      this.ctx.fillStyle = this.color;
      for (let i = 0; i < this.snake.length; i++) {
        this.ctx.fillRect(
          this.snake[i].x,
          this.snake[i].y,
          this.width,
          this.height
        );
      }
      switch (this.direction) {
        case "top":
          headImgPos = 0;
          headOffsetX = 0;
          headOffsetY = -3;
          break;
        case "right":
          headImgPos = 10;
          headOffsetX = 3;
          headOffsetY = 0;
          break;
        case "bottom":
          headImgPos = 20;
          headOffsetX = 0;
          headOffsetY = 3;
          break;
        case "left":
          headImgPos = 30;
          headOffsetX = -3;
          headOffsetY = 0;
          break;
      }
      this.ctx.drawImage(
        this.headImg,
        headImgPos,
        0,
        10,
        10,
        this.snake[0].x + headOffsetX,
        this.snake[0].y + headOffsetY,
        this.width,
        this.height
      );
    } else {
      let scoreMultiplier = this.score / 2;
      this.width = 100 + scoreMultiplier;
      this.height = 100 + scoreMultiplier;
      this.ctx.drawImage(
        this.graveImg,
        this.snake[0].x,
        this.snake[0].y,
        this.width,
        this.height
      );
    }
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
    if (this.snake[0].x >= this.ctx.canvas.width) {
      this.snake[0].x = 0;
    } else if (this.snake[0].x < 0) {
      this.snake[0].x = this.ctx.canvas.width - 1;
    } else if (this.snake[0].y >= this.ctx.canvas.height) {
      this.snake[0].y = 0;
    } else if (this.snake[0].y < 0) {
      this.snake[0].y = this.ctx.canvas.height;
    }
  }

  isGameOver() {
    for (let i = 4; i < this.snake.length; i++) {
      const hasCollided =
        this.snake[i].x === this.snake[0].x &&
        this.snake[i].y === this.snake[0].y;
      if (hasCollided) {
        this.alive = false;
        return true;
      }
    }
  }

  isEntitiesCollide(entity) {
    for (let i = 0; i < entity.snake.length; i++) {
      if (
        ((this.snake[0].x >= entity.snake[i].x &&
          this.snake[0].x <= entity.snake[i].x + entity.width) ||
          (this.snake[0].x + this.width >= entity.snake[i].x &&
            this.snake[0].x + this.width <=
              entity.snake[i].x + entity.width)) &&
        ((this.snake[0].y >= entity.snake[i].y &&
          this.snake[0].y <= entity.snake[i].y + entity.height) ||
          (this.snake[0].y + this.height >= entity.snake[i].y &&
            this.snake[0].y + this.height <= entity.snake[i].y + entity.height))
      )
        return true;
    }
  }

  drawScore() {
    this.ctx.fillStyle = this.color;
    this.ctx.font = "12px 'Press Start 2P'";
    this.ctx.fillText(`Beer: ${this.score}`, this.scorePosX, this.scorePosY);
  }

  drawGameOver(toggle) {
    if (toggle) {
      this.ctx.fillStyle = this.color;
      this.ctx.font = "48px serif";
      this.ctx.fillText(
        `${this.name} died!`,
        this.ctx.canvas.width / 2 - 96,
        this.ctx.canvas.height / 2
      );
      this.ctx.fillText(
        `Score: ${this.score}`,
        this.ctx.canvas.width / 2 - 48,
        this.ctx.canvas.height / 2 - 48
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
