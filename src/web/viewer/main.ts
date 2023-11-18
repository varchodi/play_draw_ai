import { samples } from "../../common/js_object/samples";
import { utils } from "../../common/utils";
import { createRow } from "./display";
import '../creator.css';
import './viewer.css';

const groups = utils.groupBy(samples, "student_id");
const container = document.getElementById("container")as HTMLElement;

for (let student_id in groups){
    const samples = groups[student_id];
    const studentName = samples[0].student_name;

    //create row
    createRow(container, studentName, samples);
}

