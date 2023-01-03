import Game from "./ts/game-components/Game";

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

const resizeCanvas = (width?: number, height?: number) => {
  canvas.width = width || window.innerWidth;
  canvas.height = height || window.innerHeight;
};

const getCanvasSize = () => {
  return {
    x: 0,
    y: 0,
    w: canvas.width,
    h: canvas.height,
  };
};

window.onresize = () => {
  resizeCanvas();
};

resizeCanvas();

let currentTimeStamp = 0;
const game = new Game(getCanvasSize);

const main: FrameRequestCallback = (prevTimeStamp: number) => {
  const deltaTime = prevTimeStamp - currentTimeStamp;
  currentTimeStamp = prevTimeStamp;

  game.draw(ctx);
  game.update(deltaTime);

  requestAnimationFrame(main);
};

main(0);

export {};
