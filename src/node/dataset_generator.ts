import fs from 'fs';
//canvas stuffs 
import { Canvas, createCanvas } from 'canvas';

//=================================================================
//==================Temporary due to import issues ================

type DrawNode = {
    path: (ctx: CanvasRenderingContext2D, path: [number, number][], color?: string) => void;
    paths: (ctx: Canvas, paths: [number, number][][], color?: string) => void;
}

export const draw_node: DrawNode = {
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
            draw_node.path(ctx as unknown as CanvasRenderingContext2D, path, color);
        }
    }
}

//======================================================================================
//======================================================================================

//======================================================================================
//---------------------------- must be in constant file --------------------------------
type constantTypes = {
    DATA_DIR?: string;
    RAW_DIR?: string;
    DATASET_DIR?: string;
    JSON_DIR?: string;
    IMG_DIR?: string;
    SAMPLES?: string;
}



const canvas:Canvas=createCanvas(400,400);
const ctx = canvas.getContext('2d');
//constants 
const constants:constantTypes = {};
constants.DATA_DIR = '../../data';
constants.RAW_DIR = constants.DATA_DIR + '/raw';
constants.DATASET_DIR = constants.DATA_DIR + "/dataset";
constants.JSON_DIR = constants.DATASET_DIR + "/json";
constants.IMG_DIR = constants.DATASET_DIR + "/img";
// sample files 
constants.SAMPLES = constants.DATASET_DIR + "/sample.json";
//==========================================================================================


//======================================================================================
//---------------------------- must be in utils file -----------------------------------

const utils = {
    // format the percentage
    formatPercent : (n: number) => {
        return (n * 100).toFixed(2) + "%";
    },

    //printout the process
    printProgrees : (count: number, max: number) => {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);

        //calculate percentage
        const percent = utils.formatPercent(count / max);

        process.stdout.write(count + '/' + max + '(' + percent + ')');
    }
}
//======================================================================================
const fileNames = fs.readdirSync(constants.RAW_DIR);
//create sample array;
const sample: { id: number; label: string; student_name: any; student_id: any; }[] = [];
let id = 1;



fileNames.forEach((fn: string) => {
    const content = fs.readFileSync(constants.RAW_DIR + "/" + fn);
    const { session, student, drawings } = JSON.parse(content as unknown as string);
    //console.log('content is: ' + drawings);

    for (let label in drawings) {
        //data labeling (summary)
        sample.push({
            id,
            label,
            student_name: student,
            student_id: session
        });
        //get paths
        const paths = drawings[label];
        //create file for each drawing id , and put paths (draw) there
        fs.writeFileSync(constants.JSON_DIR + "/" + id + ".json", JSON.stringify(paths));

        //generate imagesFiles for each paths (drawing)
        generateImageFile(
            constants.IMG_DIR + "/" + id +".png",
            paths
        )
        utils.printProgrees(id, fileNames.length * 8);
        id++;
    }
})


//write samples in sample.json file
fs.writeFileSync(constants.SAMPLES, JSON.stringify(sample))


//generate image function
function generateImageFile(outfile:string, paths:[number, number][][])
{
    //clear canvas before drawing on canavs
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw paths on x canvas
    draw_node.paths(ctx as unknown as any, paths);
    //make buffer
    const buffer = canvas.toBuffer("image/png");

    fs.writeFileSync(outfile, buffer);
}




