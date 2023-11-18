import * as path from 'node:path';
type constantTypes = {
    DATA_DIR?: string;
    RAW_DIR?: string;
    DATASET_DIR?: string;
    JSON_DIR?: string;
    IMG_DIR?: string;
    SAMPLES?: string;
    JS_OBJECTS?: string;
    SAMPLE_JS?: string;
}


export const constants:constantTypes = {};
constants.DATA_DIR = path.resolve(__dirname, '../data/');
constants.RAW_DIR = constants.DATA_DIR + '/raw';
constants.DATASET_DIR = constants.DATA_DIR + "/dataset";
constants.JSON_DIR = constants.DATASET_DIR + "/json";
constants.IMG_DIR = constants.DATASET_DIR + "/img";
// sample files 
constants.SAMPLES = constants.DATASET_DIR + "/sample.json";

constants.RAW_DIR = constants.DATA_DIR + '/raw';
constants.DATASET_DIR = constants.DATA_DIR + "/dataset";
constants.JSON_DIR = constants.DATASET_DIR + "/json";
constants.IMG_DIR = constants.DATASET_DIR + "/img";
// sample files 
constants.SAMPLES = constants.DATASET_DIR + "/sample.json";
//js onjects dir
constants.JS_OBJECTS = path.resolve(__dirname,'../common/js_object/')
constants.SAMPLE_JS=constants.JS_OBJECTS+"/samples.ts"

