import { GAME_DIFFICULTY } from "../utils/constants";
import LocalStorageWrapper from "../utils/LocalStorageWrapper";
import { CanvasSize, GameDifficulty } from "../utils/types";
import Ball from "./Ball";

abstract class Paddle {
  protected speed = 0.5;
  protected shouldMoveUp = false;
  protected shouldMoveDown = false;
  public x: number = 0;
  public w: number = 0;
  public h: number = 0;

  constructor(
    protected color = "white",
    public y: number,
    public owner: "HUMAN" | "COMPUTER",
    public position: "LEFT_PADDLE" | "RIGHT_PADDLE",
    canvasSize: CanvasSize,
    public ID: string
  ) {
    this.w = canvasSize.w * 0.015;
    this.h = canvasSize.h * 0.23;

    if (this.position === "LEFT_PADDLE") {
      this.x = 30;
    } else if (this.position === "RIGHT_PADDLE") {
      this.x = canvasSize.w - this.w - 30;
    }
  }

  abstract update(
    deltaTime: number,
    canvasSize: CanvasSize,
    balls?: Ball[]
  ): void;

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  // setSize(canvasSize: CanvasSize) {
  //   this.w = canvasSize.w * 0.01;
  //   this.h = canvasSize.h * 0.23;
  //   this.y = this.y >= canvasSize.h ? canvasSize.h - this.h : this.y;
  //   this.x = this.position === "LEFT_PADDLE" ? 10 : canvasSize.w - this.w - 10;
  // }
}

export class HumanPaddle extends Paddle {
  constructor(
    protected color = "white",
    public y: number,
    public position: "LEFT_PADDLE" | "RIGHT_PADDLE",
    canvasSize: CanvasSize,
    public ID: string
  ) {
    super(color, y, "HUMAN", position, canvasSize, ID);

    window.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") {
        this.shouldMoveUp = true;
        this.shouldMoveDown = false;
      } else if (event.key === "ArrowDown") {
        this.shouldMoveDown = true;
        this.shouldMoveUp = false;
      }
    });

    window.addEventListener("keyup", (event) => {
      if (event.key === "ArrowUp") {
        this.shouldMoveUp = false;
      } else if (event.key === "ArrowDown") {
        this.shouldMoveDown = false;
      }
    });
  }

  update(deltaTime: number, canvasSize: CanvasSize) {
    if (this.shouldMoveUp && this.y - this.speed > 0) {
      this.y -= this.speed * deltaTime;
    } else if (
      this.shouldMoveDown &&
      this.y + this.h + this.speed < canvasSize.h
    ) {
      this.y += this.speed * deltaTime;
    }
  }
}

export class ComputerPaddle extends Paddle {
  constructor(
    public color = "white",
    public y: number,
    public type: "LEFT_PADDLE" | "RIGHT_PADDLE",
    canvasSize: CanvasSize
  ) {
    super(color, y, "COMPUTER", type, canvasSize, "Computer");
  }

  update(deltaTime: number, canvasSize: CanvasSize, balls: Ball[]) {
    const difficulty = LocalStorageWrapper.get<GameDifficulty>(GAME_DIFFICULTY);
    if (difficulty === "EASY") {
      this.speed = 0.5;
    } else if (difficulty === "MEDIUM") {
      this.speed = 1;
    } else if (difficulty === "HARD") {
      this.speed = 2;
    }

    if (this.shouldMoveUp && this.y - this.speed > 0) {
      this.y -= this.speed * deltaTime;
    } else if (
      this.shouldMoveDown &&
      this.y + this.h + this.speed < canvasSize.h
    ) {
      this.y += this.speed * deltaTime;
    }

    // FUNCTIONALITY FOR COMPUTER
    balls.forEach((ball) => {
      const squaredArc = ball.getSquaredArc();
      if (squaredArc.y + squaredArc.h < this.y) {
        this.shouldMoveDown = false;
        this.shouldMoveUp = true;
      } else if (squaredArc.y > this.y + this.h) {
        this.shouldMoveDown = true;
        this.shouldMoveUp = false;
      } else {
        this.shouldMoveDown = false;
        this.shouldMoveUp = false;
      }
    });
  }
}

export default Paddle;
