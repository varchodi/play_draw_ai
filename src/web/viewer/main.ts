import { utils } from "../../common/utils";
import { createRow } from "./display";
import "../creator.css";
import "./viewer.css";
import { featuresTS } from "../../common/js_object/features";

const { samples, featureNames } = featuresTS;

const groups = utils.groupBy(samples.slice(-100), "student_id");
const container = document.getElementById("container") as HTMLElement;

for (let student_id in groups) {
  const samples = groups[student_id];
  const studentName = samples[0].student_name;

  //create row
  createRow(container, studentName, samples);
}

// const options={
//     size:500,
//     axesLabels:featureNames,
//     styles:utils.styles,
//     transparency:0.7,
//     icon:"image"
//  };
//  graphics.generateImages(utils.styles);

//  const chart=new Chart(
//     chartContainer,
//     samples,
//     options,
//     handleClick
//  );

console.log(samples, featureNames);
