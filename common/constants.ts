type constantTypes = {
    DATA_DIR?: string;
    RAW_DIR?: string;
    DATASET_DIR?: string;
    JSON_DIR?: string;
    IMG_DIR?: string;
    SAMPLES?: string;
}

export const constants:constantTypes = {};
constants.DATA_DIR = '../../data';
constants.RAW_DIR = constants.DATA_DIR + '/raw';
constants.DATASET_DIR = constants.DATA_DIR + "/dataset";
constants.JSON_DIR = constants.DATASET_DIR + "/json";
constants.IMG_DIR = constants.DATASET_DIR + "/img";
// sample files 
constants.SAMPLES = constants.DATASET_DIR + "/sample.json";

