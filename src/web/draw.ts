type Draw = {
    path: (ctx: CanvasRenderingContext2D, path: [number, number][], color?: string) => void;
    paths: (ctx: CanvasRenderingContext2D, paths: [number, number][][], color?: string) => void;
}
export const draw: Draw = {
    path : (ctx, path, color = "black") => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        //move to the first item
        ctx.moveTo(...path[0]);
        //?? draw other paths 
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(...path[i]);
        }

        //?? make our drawing more esthetical
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
    },

    // draw paths inside path 
    paths: (ctx, paths, color = "black") => {
        for (const path of paths) {
            //draw each paths 
            draw.path(ctx, path, color);
        }
    }
}