import { graphics } from "./graphics";
import { math } from "./math";

export type SampleTypes = {
  id: number;
  label: "basic" | "sport";
  point: [number, number];
};
export type ChartStylesType = Record<
  string,
  { color: string; text: string; image?: any }
>;

export type OptionsType = {
  size: number;
  axeLabel: string[];
  styles: ChartStylesType;
  icon?: string;
};
export class Chart {
  public samples: SampleTypes[];
  public canvas: HTMLCanvasElement = document.createElement("canvas");
  public styles: ChartStylesType = {};
  public icon = "";
  private ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  private margin = 0;
  private transparency = 0.5;
  private axesLabels = ["Kilometers", "Price"];
  public defaultDataBounds;
  private dragInfo;
  private dataTrans;

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

    this.icon = options.icon!;

    this.margin = options.size * 0.1;
    this.transparency = 0.7;

    this.dataTrans = {
      offset: [0, 0],
      scale: 1,
    };
    this.dragInfo = {
      start: [0, 0],
      end: [0, 0],
      offset: [0, 0],
      dragging: false,
    };

    //bounds
    this.pixelBounds = this.#getPixelBounds();
    this.dataBounds = this.#getDataBounds();
    this.defaultDataBounds = this.#getDataBounds();

    //draw
    this.#draw();

    //add events listeners
    this.#addEventsListeners();
  }

  //?? events listeners ...
  #addEventsListeners() {
    const { canvas, dataTrans, dragInfo } = this;
    canvas.onmousedown = (e: MouseEvent) => {
      const dataLoc = this.#getMouse(e, true);

      dragInfo.start = dataLoc;
      dragInfo.dragging = true;
    };
    //?? move
    canvas.onmousemove = (evt: MouseEvent) => {
      if (dragInfo.dragging) {
        const dataLoc = this.#getMouse(evt, true);
        dragInfo.end = dataLoc;
        dragInfo.offset = math.scale(
          math.subtract(dragInfo.start, dragInfo.end),
          dataTrans.scale
        );
        const newOffset = math.add(dataTrans.offset, dragInfo.offset);
        this.#updateDataBounds(newOffset, dataTrans.scale);

        this.#draw();
      }
    };

    canvas.onmouseup = () => {
      dataTrans.offset = math.add(dataTrans.offset, dragInfo.offset);
      dragInfo.dragging = false;
    };

    //scaling on wheel??
    canvas.onwheel = (evt: WheelEvent) => {
      const dir = Math.sign(evt.deltaY);
      const step = 0.02;
      dataTrans.scale += dir * step;
      dataTrans.scale = Math.max(step, Math.min(2, dataTrans.scale));

      this.#updateDataBounds(dataTrans.offset, dataTrans.scale);

      this.#draw();
      evt.preventDefault();
    };
  }

  //??update data bounds
  #updateDataBounds(offset: number[], scale: number) {
    const { dataBounds, defaultDataBounds: def } = this;
    dataBounds.left = def.left + offset[0];
    dataBounds.right = def.right + offset[0];
    dataBounds.top = def.top + offset[1];
    dataBounds.bottom = def.bottom + offset[1];

    const center = [
      (dataBounds.left + dataBounds.right) / 2,
      (dataBounds.top + dataBounds.bottom) / 2,
    ];
    //?? left
    dataBounds.left = math.lerp(center[0], dataBounds.left, scale ** 2);
    //?? right
    dataBounds.right = math.lerp(center[0], dataBounds.right, scale ** 2);
    //?? top
    dataBounds.top = math.lerp(center[1], dataBounds.top, scale ** 2);
    //??bottom
    dataBounds.bottom = math.lerp(center[1], dataBounds.bottom, scale ** 2);
  }

  //??get mouse coordinates or point coordinate
  #getMouse = (evt: MouseEvent, dataSpace = false): number[] => {
    const rect = this.canvas.getBoundingClientRect();
    const pixelLoc = [evt.clientX - rect.left, evt.clientY - rect.top];
    if (dataSpace) {
      const dataLoc = math.remapPoint(
        this.pixelBounds,
        this.defaultDataBounds,
        pixelLoc
      );

      return dataLoc;
    }

    return pixelLoc;
  };

  //?? methods
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
      const { point, label } = sample;
      const pixelloc = math.remapPoint(dataBounds, pixelBounds, point);
      switch (this.icon) {
        case "text":
          graphics.drawText(ctx, {
            text: this.styles[label].text,
            loc: pixelloc,
            size: 20,
          });
          break;
        case "image":
          graphics.drawimage(ctx, this.styles[label].image, pixelloc);
          break;
        default:
          graphics.drawpoint(ctx, pixelloc, this.styles[label].color);
      }
    }
  }
}
