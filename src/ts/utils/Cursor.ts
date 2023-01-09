import { BoxSize } from "./types";

class Cursor {
  private x = -15;
  private y = -15;
  private radius = 10;
  private pointerDown = {
    value: false,
    noOfTimesRegistered: 0,
  };
  private pointerUp = {
    value: false,
    noOfTimesRegistered: 0,
  };

  constructor() {
    window.addEventListener("pointermove", (event) => {
      this.x = event.x;
      this.y = event.y;
    });

    window.addEventListener("pointerdown", () => {
      this.radius = 25;
      this.pointerDown.value = true;
      this.pointerUp.value = false;
    });

    window.addEventListener("pointerup", () => {
      this.pointerDown.value = false;
      this.pointerUp.value = true;
    });
  }

  get coordinate() {
    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      w: this.radius * 2,
      h: this.radius * 2,
    };
  }

  update() {
    if (this.radius > 10) {
      this.radius--;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  isHover(boxSize: BoxSize) {
    // const isWithinBox = (target: BoxSize, reference: BoxSize) => {};

    // const boxSizeAxis = {
    //   x1: boxSize.x,
    //   x2: boxSize.x + boxSize.w,
    //   y1: boxSize.y,
    //   y2: boxSize.y + boxSize.h,
    // };

    // const squaredArcAxis = {
    //   x1: this.coordinate.x,
    //   x2: this.coordinate.x + this.coordinate.w,
    //   y1: this.coordinate.y,
    //   y2: this.coordinate.y + this.coordinate.h,
    //   x: 0,
    //   y: 0,
    // };

    return (
      this.x > boxSize.x &&
      this.x < boxSize.x + boxSize.w &&
      this.y > boxSize.y &&
      this.y < boxSize.y + boxSize.h
    );
  }

  isPointerDown(boxSize: BoxSize) {
    if (this.pointerDown.noOfTimesRegistered) {
      this.pointerDown.value = false;
      this.pointerDown.noOfTimesRegistered = 0;
    } else if (this.pointerDown.value) {
      this.pointerDown.noOfTimesRegistered++;
    }

    return this.isHover(boxSize) && this.pointerDown.value;
  }

  isPointerUp() {
    return false;
  }
}

export default Cursor;
