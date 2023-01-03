import Cursor from "../utils/Cursor";
import Ball from "./Ball";
import GameUtils from "./GameUtils";
import Menu from "./Menu";
import LocalStorageWrapper from "../utils/LocalStorageWrapper";
import Paddle, { ComputerPaddle, HumanPaddle } from "./Paddle";
import ballCollideMusicSrc from "/ball_hit.ogg";
import {
  CanvasSize,
  GameDifficulty,
  GameMode,
  PaddlePosition,
} from "../utils/types";
import {
  GAME_DIFFICULTY,
  GAME_MODE,
  PADDLE_POSITION,
  SOUND,
} from "../utils/constants";

const collideMusic = new Audio();
collideMusic.src = ballCollideMusicSrc;

class Game {
  public Utils = GameUtils;
  public menu = new Menu(this);
  public cursors = [new Cursor()];
  protected balls: Ball[] = [];
  public state = {
    isOver: false,
    isPaused: false,
    isStartNewGame: true,
  };
  private paddles: {
    score: number;
    paddle: Paddle;
  }[] = [];
  private MAX_SCORE = 10;

  constructor(private getCanvasSize: () => CanvasSize) {
    window.addEventListener("keydown", (event) => {
      if (this.state.isOver) return;
      const key = event.key.toLowerCase();

      // Pause Game
      if (key === "p") this.state.isPaused = !this.state.isPaused;
      else if (this.state.isPaused) this.state.isPaused = false;

      // New Game
      if (key === "r" && !this.menu.isOpen) this.state.isStartNewGame = true;
      //
    });
  }

  public update(deltaTime: number) {
    const canvasSize = this.getCanvasSize();

    // Create new game
    if (this.state.isStartNewGame) {
      const color = "white";

      this.balls = [
        new Ball(canvasSize.w * 0.5, canvasSize.h * 0.5, 10, canvasSize),
      ];

      for (let count = 0; count < 2; count++) {
        if (this.mode === "Single") {
          this.paddles = [
            {
              score: 0,
              paddle: new HumanPaddle(
                color,
                canvasSize.h * 0.5,
                this.paddlePosition === "LEFT" ? "LEFT_PADDLE" : "RIGHT_PADDLE",
                canvasSize,
                "Human"
              ),
            },
            {
              score: 0,
              paddle: new ComputerPaddle(
                color,
                canvasSize.h * 0.5,
                this.paddlePosition === "LEFT" ? "RIGHT_PADDLE" : "LEFT_PADDLE",
                canvasSize
              ),
            },
          ];
        }
      }

      this.state.isStartNewGame = false;
    }

    // Update Ball and Paddle
    if (!this.state.isPaused && !this.state.isOver && !this.menu.isOpen) {
      this.balls.forEach((ball) => {
        ball.update(deltaTime, canvasSize, {
          list: this.paddles.map(({ paddle }) => paddle),
          handlers: {
            collideHandler() {
              if (!collideMusic.paused) {
                collideMusic.currentTime = 0;
              }

              const isSoundOn = LocalStorageWrapper.get<boolean>(SOUND);
              isSoundOn && collideMusic.play();
            },
            ballPassPaddleHandler: (passPaddle) => {
              this.paddles.map(({ paddle }, index) => {
                if (passPaddle === paddle) {
                  const score = ++this.paddles[index ? 0 : 1].score;
                  if (score === this.MAX_SCORE) {
                    setTimeout(() => {
                      this.state.isOver = true;
                    }, 500);
                  } else {
                    setTimeout(() => {
                      ball.relaunch(canvasSize);
                    }, 1000);
                  }
                }
              });
            },
          },
        });
      });

      this.paddles.forEach(({ paddle }) => {
        paddle.update(deltaTime, canvasSize, this.balls);
      });
    }

    this.cursors.forEach((cursor) => {
      cursor.update();
    });
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const canvasSize = {
      x: 0,
      y: 0,
      w: ctx.canvas.width,
      h: ctx.canvas.height,
    };

    // clearScreen
    ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);

    ctx.textBaseline = "hanging";
    ctx.fillStyle = "white";
    (ctx as any).letterSpacing = "5px";

    if (!this.menu.isOpen) {
      this.Utils.saveAndRestore(ctx, () => {
        if (this.state.isPaused || this.state.isOver) {
          ctx.globalAlpha = 0.1;
        }

        // Draw Net
        ctx.strokeStyle = "hsla(0,0%,100%,0.5)";
        ctx.strokeRect(canvasSize.w * 0.5, -5, 5, canvasSize.h + 10);

        // Draw Balls
        this.balls.forEach((ball) => {
          ball.draw(ctx);
        });

        // Draw Paddles
        this.paddles.forEach(({ paddle, score }) => {
          this.Utils.saveAndRestore(ctx, () => {
            const fontSize = 150;

            paddle.draw(ctx);

            // Draw Score
            if (!this.state.isOver && !this.state.isPaused)
              ctx.globalAlpha = 0.3;

            ctx.fillStyle = "white";
            ctx.lineWidth = 1;
            ctx.font = `${fontSize}px Monospace`;
            ctx.fillText(
              `${score}`,
              paddle.position === "LEFT_PADDLE"
                ? canvasSize.w * 0.25 - ctx.measureText(`${score}`).width * 0.5
                : canvasSize.w * 0.75 - ctx.measureText(`${score}`).width * 0.5,
              canvasSize.h * 0.5
            );
          });
        });
      });
    }

    // Draw Game Over Screen
    if (this.state.isOver && this.getWinner && !this.menu.isOpen) {
      this.Utils.saveAndRestore(ctx, () => {
        const GAME_OVER = "GAME OVER";
        const { paddle } = this.getWinner!;

        const MAIN_INFO = `${paddle.ID} Has Won`;
        let fontSize = 80;

        ctx.font = `${fontSize}px Blomberg`;

        ctx.fillText(
          GAME_OVER,
          canvasSize.w * 0.5 - ctx.measureText(GAME_OVER).width * 0.5,
          canvasSize.h * 0.3
        );

        ctx.fillText(
          MAIN_INFO,
          canvasSize.w * 0.5 - ctx.measureText(MAIN_INFO).width * 0.5,
          canvasSize.h * 0.5
        );

        fontSize = 40;
        ctx.font = `${fontSize}px Monospace`;

        // Draw Restart Button
        const restartOption = {
          value: "Restart",
          x: canvasSize.w * 0.5 - ctx.measureText("Restart").width * 0.5,
          y: canvasSize.h * 0.7,
          w: ctx.measureText("Restart").width,
          h: ctx.measureText("Restart").actualBoundingBoxDescent,
        };

        this.Utils.createButton(
          ctx,
          { data: restartOption, hasBackground: true },
          this.cursors,
          {
            pointerDownHandler: () => {
              this.restartGame(canvasSize);
            },
            drawHandler() {
              ctx.fillStyle = "black";
              ctx.fillRect(
                restartOption.x - 5,
                restartOption.y - 5,
                restartOption.w + 10,
                restartOption.h + 15
              );

              ctx.fillStyle = "white";
              ctx.fillText(
                restartOption.value,
                restartOption.x,
                restartOption.y
              );
            },
          }
        );
      });
    }

    // Game Paused
    if (this.state.isPaused && !this.menu.isOpen && !this.state.isOver) {
      this.Utils.saveAndRestore(ctx, () => {
        const GAME_PAUSED = "GAME PAUSED";
        const fontSize = 100;

        ctx.font = `${fontSize}px Blomberg`;
        ctx.fillText(
          GAME_PAUSED,
          canvasSize.w * 0.5 - ctx.measureText(GAME_PAUSED).width * 0.5,
          canvasSize.h * 0.5
        );
      });
    }

    // Draw Menu
    this.menu.draw(ctx);

    // draw cursor
    this.cursors.forEach((cursor) => {
      cursor.draw(ctx);
    });
  }

  public get mode() {
    return LocalStorageWrapper.get<GameMode>(GAME_MODE) || "Single";
  }

  public set mode(value) {
    LocalStorageWrapper.set(GAME_MODE, value);
  }

  public get paddlePosition() {
    return LocalStorageWrapper.get<PaddlePosition>(PADDLE_POSITION) || "RANDOM";
  }

  public set paddlePosition(value) {
    LocalStorageWrapper.set(PADDLE_POSITION, value);
  }

  public get computerDifficulty() {
    return LocalStorageWrapper.get<GameDifficulty>(GAME_DIFFICULTY) || "MEDIUM";
  }

  public set computerDifficulty(value) {
    LocalStorageWrapper.set(GAME_DIFFICULTY, value);
  }

  public get isSoundOn() {
    return LocalStorageWrapper.get<boolean>(SOUND);
  }

  public set isSoundOn(value) {
    LocalStorageWrapper.set(SOUND, value);
  }

  private get getWinner() {
    if (this.paddles[0].score === this.MAX_SCORE) return this.paddles[0];
    if (this.paddles[1].score === this.MAX_SCORE) return this.paddles[1];
    return null;
  }

  private restartGame(canvasSize: CanvasSize) {
    this.paddles = [
      {
        score: 0,
        paddle: new HumanPaddle(
          "white",
          canvasSize.h * 0.5,
          "LEFT_PADDLE",
          canvasSize,
          "Ziike"
        ),
      },
      {
        score: 0,
        paddle: new ComputerPaddle(
          "white",
          canvasSize.h * 0.5,
          "RIGHT_PADDLE",
          canvasSize
        ),
      },
    ];

    this.balls = [
      new Ball(canvasSize.w * 0.5, canvasSize.h * 0.5, 10, canvasSize),
    ];

    this.state.isOver = false;
    this.state.isStartNewGame = false;
    this.state.isPaused = false;
  }
}

export default Game;
