import { draw } from "./draw";

class SketchPad{
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    //drawing paths
    private path: [number, number][];
    // array of all drawing paths 
    public paths: Array<typeof this.path>;

    private isDrawing: boolean;

    
    
    // btn dom elemts 
    private undobtn: HTMLButtonElement;
    
    // #addEventListener: () => void;
    constructor(container:HTMLDivElement, size: number = 400) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = size;
        this.canvas.height = size;
        
        // this.canvas.style=``
        //link to conatiner in html
        container.appendChild(this.canvas);

        //undo btns dom componets 
        const lineBreack = document.createElement("br") as HTMLBRElement
        container.appendChild(lineBreack);

        //undo btn
        this.undobtn = document.createElement("button");
        this.undobtn.innerHTML = "UNDO";
        container.appendChild(this.undobtn);

        //canvas context
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

        //drawing paths
        this.path = [];
        // array of path
        this.paths = [];
        //?? id drawing
        this.isDrawing = false;

        //?? reset (on start , a kind of fresh start)
        this.reset()

        // !! mouse interaction (call mouse events )
        this.#addEventListener();

        

    }

    // reset the scetchpad (and remove all drawings ..)
    reset() {
        this.path = [];
        this.paths = [];
        this.isDrawing = false;

        //?? call redraw to fech for past paths
        this.#redraw();
    }

    //events 
    #addEventListener() {
        this.canvas.onmousedown = (evt: MouseEvent) => {
            // create path (lines,here we get only the first point); according to mouse coordinates;array of mouse coordinates
            //no indeed ??
            //this.path = [this.#getMouse(evt)];
            //?? check this one path or paths ??
            this.paths.push( [this.#getMouse(evt)]);
            //??
            this.isDrawing = true;
        }

        // on drawing
        this.canvas.onmousemove = (evt: MouseEvent) => {
            if (this.isDrawing) {
                
                //get last path 
                const lastPath = this.paths[this.paths.length - 1];
                // push other coordinates in the path array
                // this.path.push(this.#getMouse(evt));

                //?? update, push mouse in last path
                lastPath.push(this.#getMouse(evt));
                

                // //?? try out
                // console.log(this.path.length);

                //?? redraw path on the canvas
                this.#redraw();
            }
        }
        
        //on mouse up(when mouse (mouse key) not pressed)
        // on drawing
        this.canvas.onmouseup = () => {
            this.isDrawing = false;
        }

        //touch screen events 
        //?? have to be updated -->

        // when we start touching the screen
        this.canvas.ontouchstart = (evt: any) => {
            //touch location (get only first touch(finger))
            const loc = evt?.touches[0];
            //?? call mousedown evt
            this?.canvas?.onmousedown(loc);
        }

        //when mouving fingers (touches)
        this.canvas.ontouchmove = (evt: any) => {
            //only one finger
            const loc = evt?.touches[0];
            this.canvas.onmousemove(evt);
        }

        //when we release our finger
        this.canvas.ontouchend = () => {
            this?.canvas?.onmouseup();
        }

        //undo events and functionalities
        this.undobtn.onclick = () => {
            //remove the last path
            this.paths.pop();
            // redraw everything ../.
            this.#redraw();
        }
    }

    #getMouse = (evt:MouseEvent) => {
        //get canvas position (or coordinates a,b,c,d)
        const rect = this.canvas.getBoundingClientRect();
        //?? get mouse coordinates (according to the canvas)
        const mouse:[number,number] = [
            //client x is coordinate x of mouse position
            Math.round(evt.clientX - rect.left),
            Math.round(evt.clientY-rect.top)
        ]
        //?? try it out
        //console.log(mouse);

        return mouse;
    }

    //?? redrawdraw paths 
    #redraw = () => {
        //clear up the canvas 
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        //draw.path(this.ctx, this.path);
        //?? updated , we draw pathes now
        draw.paths(this.ctx, this.paths);

        //disable redo button when paths is empty
        if (this.paths.length > 0) {
            this.undobtn.disabled = false;
        } else {
            this.undobtn.disabled = true;
        }
    }
    
}


export default SketchPad