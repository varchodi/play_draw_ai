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
    ctx.globalAlpha = this.transparency;
    this.#drawSamples();
    ctx.globalAlpha = 1;
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
