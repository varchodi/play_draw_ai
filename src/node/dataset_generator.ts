import fs from 'fs'

type constantTypes = {
    DATA_DIR?: string;
    RAW_DIR?: string;
    DATASET_DIR?: string;
    JSON_DIR?: string;
    IMG_DIR?: string;
    SAMPLES?: string;
}

//canvas stuffs 
import { Canvas, createCanvas } from 'canvas';
import { draw_node } from './draw';
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

const fileNames = fs.readdirSync(constants.RAW_DIR);
//create sample array;
const sample: { id: number; label: string; student_name: any; student_id: any; }[] = [];
let id = 1;

fileNames.forEach(fn => {
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
            constants.IMG_DIR + "/" + ".png",
            paths
        )
        id++;
    }
})


//write samples in sample.json file
fs.writeFileSync(constants.SAMPLES, JSON.stringify(sample))

//generate image function
function generateImageFile(outfile:string, paths:[number, number][][])
{
    draw_node.paths(ctx as unknown as any, paths);
    //make buffer
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outfile, buffer);
}
