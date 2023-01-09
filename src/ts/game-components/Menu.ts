import Game from "./Game";
import LocalStorageWrapper from "../utils/LocalStorageWrapper";
import GameUtils from "./GameUtils";
import soundOnSrc from "/volume_up.svg";
import soundOffSrc from "/volume_mute.svg";
import {
  GAME_DIFFICULTY,
  GAME_MODE,
  PADDLE_POSITION,
} from "../utils/constants";
import {
  BoxSize,
  GameDifficulty,
  GameMode,
  PaddlePosition,
} from "../utils/types";

const soundOnImage = new Image();
soundOnImage.src = soundOnSrc;

const soundOffImage = new Image();
soundOffImage.src = soundOffSrc;

class Menu {
  public isOpen = false;
  private optionVisible = {
    isGameMode: true,
    isSingleGameMode: false,
    isDoubleGameMode: false,
    isDifficulty: false,
    isPosition: false,
  };

  constructor(private game: Game) {
    window.addEventListener("keydown", (event) => {
      if (this.game.state.isOver) return;
      const key = event.key.toLowerCase();

      if (key === "m") {
        this.toggleMenuVisibility();
      }
    });
  }

  setVisibleOption(option: keyof typeof this.optionVisible | null) {
    (Object.keys(this.optionVisible) as typeof option[]).forEach((key) => {
      this.optionVisible[key!] = option === key;
    });
  }

  private toggleMenuVisibility() {
    this.isOpen = !this.isOpen;
    this.game.state.isPaused = this.isOpen;
    this.setVisibleOption(this.isOpen ? "isGameMode" : null);
  }

  update() {}

  draw(ctx: CanvasRenderingContext2D) {
    const canvasSize = {
      x: 0,
      y: 0,
      w: ctx.canvas.width,
      h: ctx.canvas.height,
    };

    // draw burga-nav btnm
    {
      const burgaNav: BoxSize = {
        x: canvasSize.w * 0.955,
        y: canvasSize.h * 0.02,
        w: 50,
        h: 40,
      };

      GameUtils.createButton(
        ctx,
        { data: burgaNav, hasBackground: true },
        this.game.cursors,
        {
          pointerDownHandler: () => {
            this.toggleMenuVisibility();
          },
          drawHandler: () => {
            if (this.isOpen) {
              ctx.lineWidth = 10;
              ctx.strokeStyle = "white";
              ctx.beginPath();
              ctx.moveTo(burgaNav.x, burgaNav.y);
              ctx.lineTo(burgaNav.x + burgaNav.w, burgaNav.y + burgaNav.h);
              ctx.moveTo(burgaNav.x, burgaNav.y + burgaNav.h);
              ctx.lineTo(burgaNav.x + burgaNav.w, burgaNav.y);
              ctx.stroke();
            } else {
              ctx.fillRect(burgaNav.x, burgaNav.y, burgaNav.w, 10);
              ctx.fillRect(burgaNav.x, burgaNav.y + 15, burgaNav.w, 10);
              ctx.fillRect(burgaNav.x, burgaNav.y + 30, burgaNav.w, 10);
              // ctx.fillRect(menu.x, menu.y, menu.w, menu.h);
            }
          },
        }
      );
    }

    if (this.isOpen) {
      // Draw First Question
      if (this.optionVisible.isGameMode) {
        const GAME_TITLE = "PONG";
        let fontSize = 150;

        this.game.Utils.saveAndRestore(ctx, () => {
          ctx.globalAlpha = 1;
          ctx.font = `${fontSize}px Blomberg`;
          ctx.fillText(
            GAME_TITLE,
            canvasSize.w * 0.5 - ctx.measureText(GAME_TITLE).width * 0.5,
            canvasSize.h * 0.1
          );

          // Draw Middle Line
          this.drawMiddleLine(ctx, { isFull: false });
        });

        // Options
        fontSize = 80;
        ctx.font = `${fontSize}px Blomberg`;
        ctx.textBaseline = "hanging";

        [
          {
            text: "1 Player" as const,
            value: "Single" as const,
            x: canvasSize.w * 0.25 - ctx.measureText("1 Player").width * 0.5,
            y: canvasSize.h * 0.7,
            w: ctx.measureText("1 Player").width,
            h: ctx.measureText("1 Player").actualBoundingBoxDescent,
          },
          {
            text: "2 Players" as const,
            value: "Double" as const,
            x: canvasSize.w * 0.75 - ctx.measureText("2 Players").width * 0.5,
            y: canvasSize.h * 0.7,
            w: ctx.measureText("2 Players").width,
            h: ctx.measureText("2 Players").actualBoundingBoxDescent,
          },
        ].forEach((option) => {
          this.game.Utils.createButton(
            ctx,
            { data: option },
            this.game.cursors,
            {
              drawHandler() {
                ctx.fillText(option.text, option.x, option.y);
              },
              pointerDownHandler: () => {
                if (option.value === "Single") {
                  LocalStorageWrapper.set<GameMode>(GAME_MODE, option.value);
                  this.setVisibleOption("isSingleGameMode");
                } else if (option.value === "Double") {
                  location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
                }
              },
            }
          );
        });
      }
      // MULTI-PLAYER QUESTIONS BEGIN
      // MULTI-PLAYER QUESTIONS END
      ////////////////////// ///////////

      // SINGLE PLAYER QUESTIONS BEGIN

      // Draw "Single Player" Option Titles
      if (this.optionVisible.isSingleGameMode) {
        const GAME_TITLE = "PONG";
        let fontSize = 150;

        this.game.Utils.saveAndRestore(ctx, () => {
          ctx.globalAlpha = 1;
          ctx.font = `${fontSize}px Blomberg`;
          ctx.fillText(
            GAME_TITLE,
            canvasSize.w * 0.5 - ctx.measureText(GAME_TITLE).width * 0.5,
            canvasSize.h * 0.1
          );

          // Draw Middle Line
          this.drawMiddleLine(ctx, { isFull: false });
        });

        // Options
        fontSize = 80;
        ctx.font = `${fontSize}px Blomberg`;
        ctx.textBaseline = "hanging";

        [
          {
            text: "Difficulty" as const,
            x: canvasSize.w * 0.25 - ctx.measureText("Difficulty").width * 0.5,
            y: canvasSize.h * 0.7,
            w: ctx.measureText("Difficulty").width,
            h: ctx.measureText("Difficulty").actualBoundingBoxDescent,
          },
          {
            text: "Position" as const,
            x: canvasSize.w * 0.75 - ctx.measureText("Position").width * 0.5,
            y: canvasSize.h * 0.7,
            w: ctx.measureText("Position").width,
            h: ctx.measureText("Position").actualBoundingBoxDescent,
          },
        ].forEach((option) => {
          this.game.Utils.createButton(
            ctx,
            { data: option },
            this.game.cursors,
            {
              drawHandler() {
                ctx.fillText(option.text, option.x, option.y);
              },
              pointerDownHandler: () => {
                if (option.text === "Difficulty") {
                  this.setVisibleOption("isDifficulty");
                } else {
                  this.setVisibleOption("isPosition");
                }
              },
            }
          );
        });
      }

      // Draw "Single Player" Difficulty Configs
      if (this.optionVisible.isDifficulty) {
        const fontSize = 100;
        ctx.font = `${fontSize}px Blomberg`;

        [
          {
            value: "EASY" as const,
            x: canvasSize.w * 0.5 - ctx.measureText("EASY").width * 0.5,
            y:
              (canvasSize.h -
                ctx.measureText("EASY").actualBoundingBoxDescent) /
              4,
            w: ctx.measureText("EASY").width,
            h: ctx.measureText("EASY").actualBoundingBoxDescent,
          },
          {
            value: "MEDIUM" as const,
            x: canvasSize.w * 0.5 - ctx.measureText("MEDIUM").width * 0.5,
            y:
              ((canvasSize.h -
                ctx.measureText("MEDIUM").actualBoundingBoxDescent) /
                4) *
              2,
            w: ctx.measureText("MEDIUM").width,
            h: ctx.measureText("MEDIUM").actualBoundingBoxDescent,
          },
          {
            value: "HARD" as const,
            x: canvasSize.w * 0.5 - ctx.measureText("HARD").width * 0.5,
            y:
              ((canvasSize.h -
                ctx.measureText("HARD").actualBoundingBoxDescent) /
                4) *
              3,
            w: ctx.measureText("HARD").width,
            h: ctx.measureText("HARD").actualBoundingBoxDescent,
          },
        ].forEach((option) => {
          this.game.Utils.createButton(
            ctx,
            { data: option },
            this.game.cursors,
            {
              drawHandler() {
                ctx.fillText(option.value, option.x, option.y);
              },
              pointerDownHandler: () => {
                LocalStorageWrapper.set<GameDifficulty>(
                  GAME_DIFFICULTY,
                  option.value
                );
                this.setVisibleOption("isSingleGameMode");
              },
            }
          );
        });
      }

      // Draw "Single Player" Position Configs
      if (this.optionVisible.isPosition) {
        const fontSize = 130;
        ctx.font = `${fontSize}px Blomberg`;

        this.game.Utils.saveAndRestore(ctx, () => {
          [
            {
              value: "LEFT" as const,
              x: canvasSize.w * 0.25 - ctx.measureText("LEFT").width * 0.5,
              y: canvasSize.h * 0.5,
              w: ctx.measureText("LEFT").width,
              h: ctx.measureText("LEFT").actualBoundingBoxDescent,
            },
            {
              value: "RIGHT" as const,
              x: canvasSize.w * 0.75 - ctx.measureText("RIGHT").width * 0.5,
              y: canvasSize.h * 0.5,
              w: ctx.measureText("RIGHT").width,
              h: ctx.measureText("RIGHT").actualBoundingBoxDescent,
            },
          ].forEach((option) => {
            this.game.Utils.createButton(
              ctx,
              { data: option },
              this.game.cursors,
              {
                drawHandler() {
                  ctx.fillText(option.value, option.x, option.y);
                },
                pointerDownHandler: () => {
                  this.setVisibleOption("isSingleGameMode");
                  LocalStorageWrapper.set<PaddlePosition>(
                    PADDLE_POSITION,
                    option.value
                  );
                },
              }
            );
          });

          // Draw Middle Line
          this.drawMiddleLine(ctx, { isFull: true });
          this.game.state.isStartNewGame = true;
        });
      }

      // ///////////////////////////
      // SINGLE PLAYER QUESTIONS END

      // Draw A Back Arrow
      // Will show in some scenarios
      // if (!this.optionVisible.isGameMode) {
      if (!this.optionVisible.isGameMode) {
        const backArrowBoxSize: BoxSize = {
          h: 100,
          w: 70,
          x: 15,
          y: canvasSize.h / 2,
        };

        this.game.Utils.createButton(
          ctx,
          {
            data: {
              ...backArrowBoxSize,
              y: backArrowBoxSize.y - backArrowBoxSize.h * 0.5,
            },
          },
          this.game.cursors,
          {
            drawHandler: () => {
              for (let count = 0; count < 4; count++) {
                ctx.strokeStyle = "#fff";
                ctx.fillStyle = "#fff";
                ctx.beginPath();
                ctx.moveTo(backArrowBoxSize.x, backArrowBoxSize.y);
                ctx.lineTo(
                  backArrowBoxSize.x + backArrowBoxSize.w,
                  backArrowBoxSize.y - backArrowBoxSize.h * 0.5
                );
                ctx.lineTo(
                  backArrowBoxSize.x + backArrowBoxSize.w,
                  backArrowBoxSize.y + backArrowBoxSize.h * 0.5
                );
                ctx.closePath();
                ctx.stroke();

                // backArrowBoxSize
                backArrowBoxSize.h -= 14;
                backArrowBoxSize.w -= 10;
                backArrowBoxSize.x += 6;
              }
              ctx.fill();
            },
            pointerDownHandler: () => {
              if (this.optionVisible.isSingleGameMode) {
                this.setVisibleOption("isGameMode");
              } else if (
                this.optionVisible.isDifficulty ||
                this.optionVisible.isPosition
              ) {
                this.setVisibleOption("isSingleGameMode");
              }
            },
          }
        );
      }

      // Draw Sound Control Button
      const soundImageBoxSize: BoxSize = {
        h: 45,
        w: 45,
        x: 10,
        y: 5,
      };

      this.game.Utils.createButton(
        ctx,
        { data: soundImageBoxSize },
        this.game.cursors,
        {
          drawHandler: () => {
            ctx.drawImage(
              this.game.isSoundOn ? soundOnImage : soundOffImage,
              soundImageBoxSize.x,
              soundImageBoxSize.y,
              soundImageBoxSize.w,
              soundImageBoxSize.h
            );
          },
          pointerDownHandler: () => {
            this.game.isSoundOn = !this.game.isSoundOn;
          },
        }
      );
    }
  }

  private drawMiddleLine(
    ctx: CanvasRenderingContext2D,
    options = { isFull: true }
  ) {
    const canvasSize = {
      x: 0,
      y: 0,
      w: ctx.canvas.width,
      h: ctx.canvas.height,
    };

    // Draw Middle Line
    ctx.beginPath();
    ctx.moveTo(
      canvasSize.w * 0.497,
      canvasSize.h * (options.isFull ? 0 : 0.45)
    );
    ctx.lineTo(canvasSize.w * 0.497, canvasSize.h - (options.isFull ? 0 : 20));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(
      canvasSize.w * 0.502,
      canvasSize.h * (options.isFull ? 0 : 0.45)
    );
    ctx.lineTo(canvasSize.w * 0.502, canvasSize.h - (options.isFull ? 0 : 20));
    ctx.stroke();
  }
}

export default Menu;
