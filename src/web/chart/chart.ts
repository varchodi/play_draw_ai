import { graphics } from "./graphics";
import { math } from "./math";

export type SampleTypes = {
  id: number;
  label: "basic" | "sport";
  point: [number, number];
};
export type ChartStylesType = Record<string, string>;

export type OptionsType = {
  size: number;
  axeLabel: string[];
  styles: ChartStylesType;
};
export class Chart {
  public samples: SampleTypes[];
  public canvas: HTMLCanvasElement = document.createElement("canvas");
  public styles: ChartStylesType = {};
  private ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  private margin = 0;
  private transparency = 0.5;
  private axesLabels = ["Kilometers", "Price"];

  public pixelBounds: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };

  public dataBounds: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };

  constructor(
    container: HTMLDivElement,
    samples: SampleTypes[],
    options: OptionsType
  ) {
    this.samples = samples;
    this.styles = options.styles;
    this.canvas.width = options.size;
    this.canvas.height = options.size;
    this.canvas.style.backgroundColor = "white";
    container.appendChild(this.canvas);

    this.margin = options.size * 0.1;
    this.transparency = 0.5;
    //bounds
    this.pixelBounds = this.#getPixelBounds();
    this.dataBounds = this.#getDataBounds();

    //draw
    this.#draw();
  }
  #getPixelBounds() {
    const { canvas, margin } = this;
    const bounds = {
      left: margin,
      right: canvas.width - margin,
      top: margin,
      bottom: canvas.height - margin,
    };
    return bounds;
  }

  #getDataBounds() {
    const { samples } = this;
    const x = samples.map((s) => s.point[0]);
    const y = samples.map((s) => s.point[1]);

    return {
      left: Math.min(...x),
      right: Math.max(...x),
      top: Math.max(...y),
      bottom: Math.min(...y),
    };
  }

  //draw
  #draw() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //draw axes
    this.#drawAxes();
    ctx.globalAlpha = this.transparency;
    this.#drawSamples();
    ctx.globalAlpha = 1;
  }

  //draw axes methods
  #drawAxes() {
    const { ctx, canvas, axesLabels, margin } = this;
    const { left, right, top, bottom } = this.pixelBounds;

    graphics.drawText(ctx, {
      text: axesLabels[0],
      loc: [canvas.width / 2, bottom + margin / 2],
      size: margin * 0.6,
    });

    ctx.save();
    ctx.translate(left - margin / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);

    graphics.drawText(ctx, {
      text: axesLabels[1],
      loc: [0, 0],
      size: margin * 0.6,
    });

    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left, bottom);
    ctx.lineTo(right, bottom);
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "lightgray";
    ctx.stroke();
    ctx.setLineDash([]);

    //get minimum values
    const dataMin = math.remapPoint(this.pixelBounds, this.dataBounds, [
      left,
      bottom,
    ]);

    //display minimum kilometers
    graphics.drawText(ctx, {
      text: math.formatnumber(dataMin[0], 2),
      loc: [left, bottom],
      size: margin * 0.3,
      align: "left",
      vAlign: "top",
    });

    //display minimum price
    ctx.save();
    ctx.translate(left, bottom);
    ctx.rotate(-Math.PI / 2);
    graphics.drawText(ctx, {
      text: math.formatnumber(dataMin[1], 2),
      loc: [0, 0],
      size: margin * 0.3,
      align: "left",
      vAlign: "bottom",
    });
    ctx.restore();

    //get maximum values
    const dataMax = math.remapPoint(this.pixelBounds, this.dataBounds, [
      right,
      top,
    ]);

    //display maximum kilometers
    graphics.drawText(ctx, {
      text: math.formatnumber(dataMax[0], 2),
      loc: [right, bottom],
      size: margin * 0.3,
      align: "right",
      vAlign: "top",
    });

    //display maximum price
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(-Math.PI / 2);
    graphics.drawText(ctx, {
      text: math.formatnumber(dataMax[1], 2),
      loc: [0, 0],
      size: margin * 0.3,
      align: "right",
      vAlign: "bottom",
    });
    ctx.restore();
  }

  //sample drawing
  #drawSamples() {
    const { ctx, samples, dataBounds, pixelBounds } = this;

    for (const sample of samples) {
      const { point } = sample;
      const pixelloc = math.remapPoint(dataBounds, pixelBounds, point);
      graphics.drawpoint(ctx, pixelloc);
    }
  }
}
