import * as fs from 'node:fs';

//canvas stuffs 
import { Canvas, createCanvas } from 'canvas';
import { draw_node } from '../common/draw';
import { utils } from '../common/utils';
import { constants } from '../common/constants';

//=================================================================
//==================Temporary due to import issues ================


//======================================================================================
//======================================================================================

//======================================================================================
//---------------------------- must be in constant file --------------------------------



const canvas:Canvas=createCanvas(400,400);
const ctx = canvas.getContext('2d');
//constants 


//==========================================================================================


//======================================================================================
//---------------------------- must be in utils file -----------------------------------


//======================================================================================


const fileNames = fs.readdirSync(constants.RAW_DIR!);
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
fs.writeFileSync(constants.SAMPLES!, JSON.stringify(sample))


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




