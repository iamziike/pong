import { CanvasSize } from "../utils/types";
import Paddle from "./Paddle";

class Ball {
  private isOutOfBoundsRegistered = false;
  private speedY = Math.random() * 5 > 2.5 ? 0.1 : -0.1;
  private speedX = Math.random() * 5 < 2.5 ? 0.2 : -0.2;
  color = "white";
  w = 0;
  h = 0;

  constructor(
    public x: number,
    public y: number,
    public radius: number,
    canvasSize: CanvasSize
  ) {
    // setupCode
    // this.setSize(canvasSize);
  }

  getSquaredArc() {
    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      w: this.radius * 2,
      h: this.radius * 2,
    };
  }

  update(
    deltaTime: number,
    canvasSize: CanvasSize,
    paddles: {
      list: Paddle[];
      handlers: {
        collideHandler?: (paddle: Paddle) => void;
        /**
         *
         * @param paddle
         *
         * Will be executed once
         *
         * Refreshes onBallRelaunch
         */
        ballPassPaddleHandler?: (paddle: Paddle) => void;
      };
    }
  ) {
    const squaredArc = this.getSquaredArc();

    // top and bottom wall collision detection
    if (squaredArc.y - this.speedY <= 0) {
      this.speedY = Math.abs(this.speedY);
    } else if (squaredArc.y + squaredArc.h + this.speedY > canvasSize.h) {
      this.speedY = -Math.abs(this.speedY);
    }

    // paddles collision detection
    paddles.list.filter((paddle) => {
      const topInBetweenPaddle =
        squaredArc.y <= paddle.y + paddle.h && squaredArc.y >= paddle.y;
      const bottomInBetweenPaddle =
        squaredArc.y + squaredArc.h >= paddle.y &&
        squaredArc.y + squaredArc.h <= paddle.y + paddle.h;

      const isXAxisCollideLeftPaddle = squaredArc.x <= paddle.x + paddle.w;
      const isXAxisCollideRightPaddle = squaredArc.x + squaredArc.w >= paddle.x;
      const isYAxisCollidePaddleTop = squaredArc.y + squaredArc.h >= paddle.y;
      const isYAxisCollidePaddleMiddle = squaredArc.y + squaredArc.h > paddle.y;
      const isYAxisCollidePaddleBottom = "";

      // LEFT POSITION & //RIGHT POSITION
      // hitting the top side of the paddle
      const isBallCollideWithPaddleTop =
        squaredArc.y + squaredArc.h >= paddle.y &&
        squaredArc.y + squaredArc.h < paddle.y + paddle.h &&
        squaredArc.x;

      const isOutLeftPaddleBounds =
        paddle.position === "LEFT_PADDLE" &&
        squaredArc.x + squaredArc.w < paddle.x;

      const isOutOfRightPaddleBounds =
        paddle.position === "RIGHT_PADDLE" &&
        squaredArc.x + squaredArc.w > paddle.x + paddle.w;

      if (topInBetweenPaddle || bottomInBetweenPaddle) {
        if (
          paddle.position === "LEFT_PADDLE" &&
          (squaredArc.x - this.speedX <= paddle.x + paddle.w ||
            squaredArc.x <= paddle.x + paddle.w) &&
          !isOutLeftPaddleBounds
        ) {
          this.speedX = Math.abs(this.speedX);
          paddles.handlers.collideHandler &&
            paddles.handlers.collideHandler(paddle);
        } else if (
          paddle.position === "RIGHT_PADDLE" &&
          (squaredArc.x + squaredArc.w + this.speedX >= paddle.x ||
            squaredArc.x + squaredArc.w >= paddle.x) &&
          !isOutOfRightPaddleBounds
        ) {
          this.speedX = -Math.abs(this.speedX);
          paddles.handlers.collideHandler &&
            paddles.handlers.collideHandler(paddle);
        }
      }

      // invoke function after the ball passes the a specific paddle
      if (paddles.handlers.ballPassPaddleHandler) {
        if (isOutLeftPaddleBounds) {
          !this.isOutOfBoundsRegistered &&
            paddles.handlers?.ballPassPaddleHandler(paddle);

          this.isOutOfBoundsRegistered = true;
        } else if (isOutOfRightPaddleBounds) {
          !this.isOutOfBoundsRegistered &&
            paddles.handlers?.ballPassPaddleHandler(paddle);

          this.isOutOfBoundsRegistered = true;
        }
      }
    });

    // this.accumulatedTime += deltaTime;

    // if (this.accumulatedTime > 5000) {
    //   this.speedX += this.speedX < 0 ? -0.05 : 0.05;
    //   this.speedY += this.speedY < 0 ? -0.05 : 0.05;
    //   this.accumulatedTime = 0;
    // }

    this.x += this.speedX * deltaTime;
    this.y += this.speedY * deltaTime;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  relaunch(canvasSize: CanvasSize) {
    this.isOutOfBoundsRegistered = false;

    this.x = this.speedX < 0 ? canvasSize.w * 0.2 : canvasSize.w * 0.8;
    this.y = canvasSize.h * 0.5;

    this.speedY = this.speedY < 0 ? 0.1 : -0.1;
    this.speedX = this.speedX < 0 ? 0.2 : -0.2;
  }

  // setSize(canvasSize: CanvasSize) {
  //   // this.w = canvasSize.w * 0.01;
  //   // this.h = canvasSize.h * 0.23;
  //   // this.y = this.y >= canvasSize.h ? canvasSize.h - this.h : this.y;
  // }
}

export default Ball;
