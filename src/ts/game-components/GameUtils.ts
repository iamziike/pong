import Cursor from "../utils/Cursor";
import LocalStorageWrapper from "../utils/LocalStorageWrapper";
import clickMusicSrc from "/game_click.wav";
import { SOUND } from "../utils/constants";
import { BoxSize } from "../utils/types";

const clickMusic = new Audio();
clickMusic.src = clickMusicSrc;

abstract class GameUtils {
  static saveAndRestore(ctx: CanvasRenderingContext2D, callback: VoidFunction) {
    ctx.save();
    callback();
    ctx.restore();
  }

  static createButton(
    ctx: CanvasRenderingContext2D,
    boxSize: {
      data: BoxSize;
      hasBackground?: boolean;
    },
    cursor: Cursor[],
    handlers: {
      hoverHandler?: VoidFunction;
      drawHandler?: VoidFunction;
      pointerDownHandler?: VoidFunction;
      pointerUpHandler?: VoidFunction;
    }
  ) {
    this.saveAndRestore(ctx, () => {
      ctx.globalAlpha = 0.4;

      cursor.forEach((cursor) => {
        if (cursor.isHover(boxSize.data)) {
          ctx.globalAlpha = 1;

          handlers.drawHandler && handlers?.drawHandler();
          if (cursor.isPointerDown(boxSize.data)) {
            handlers.pointerDownHandler && handlers.pointerDownHandler();
            if (!clickMusic.paused) {
              clickMusic.currentTime = 0;
            }

            const isSoundOn = LocalStorageWrapper.get<boolean>(SOUND);
            isSoundOn && clickMusic.play();
          }
          if (cursor.isPointerUp()) {
            handlers.pointerUpHandler && handlers.pointerUpHandler();
          }
        } else {
          handlers.drawHandler && handlers.drawHandler();
        }
      });
    });
  }
}

export default GameUtils;
