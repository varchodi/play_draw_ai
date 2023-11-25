import { CanvasTextAlign } from "canvas";

export const graphics = {
  drawpoint: (
    ctx: CanvasRenderingContext2D,
    loc: [number, number],
    color = "black",
    size = 8
  ) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(...loc, size / 2, 0, Math.PI * 2);
    ctx.fill();
  },
  drawText: (
    ctx: CanvasRenderingContext2D,
    {
      text,
      loc,
      align = "center",
      vAlign = "middle",
      size = 10,
      color = "black",
    }: {
      text: any;
      loc: [number, number];
      align?: CanvasTextAlign;
      vAlign?: CanvasTextBaseline;
      size?: number;
      color?: string;
    }
  ) => {
    ctx.textAlign = align;
    ctx.textBaseline = vAlign;
    ctx.font = `bold ${size}px Courier`;
    ctx.fillStyle = color;
    ctx.fillText(text, ...loc);
  },
};
