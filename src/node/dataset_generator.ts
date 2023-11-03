import fs from 'fs'

type constantTypes = {
    DATA_DIR?: string;
    RAW_DIR?: string;
    DATASET_DIR?: string;
    JSON_DIR?: string;
    IMG_DIR?: string;
    SAMPLES?: string;
}
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
        sample.push({
            id,
            label,
            student_name: student,
            student_id: session
        });
        id++;
    }
})

console.log(sample[1]);

fs.writeFileSync(constants.SAMPLES,JSON.stringify(sample))
