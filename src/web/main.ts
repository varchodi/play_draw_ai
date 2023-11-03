import './creator.css'

import SketchPad from './sketchPad'

const container = document.getElementById("sketchPadContainer") as HTMLDivElement;
const startBtn = document.getElementById("start") as HTMLButtonElement;
const instructionSpan = document.getElementById("instructions") as HTMLSpanElement;
//const advanceBtn = document.getElementById("advanceBtn") as HTMLButtonElement;

const sketchPad = new SketchPad(container);

//for data stuffs
let index = 0;
const labels = ["car", "fish", "house", "tree", "bicycle", "guitar", "pencil", "clock"];


const data: {
    student: string,
    session: number,
    drawings:Record<string,[number,number][][]>
} = {
    student: "",
    session: new Date().getTime(),
    drawings:{}
}

function start() {
    const studentField = document.getElementById("student") as HTMLInputElement;
    if (studentField.value == "") {
        alert("please type your name please");
        return;
    }

    data.student = studentField.value;
    studentField.style.display = "none";
    container.style.visibility = "visible";
    container.style.display = "block";

    //set label and instructions
    const label = labels[index];
    instructionSpan.innerHTML = "Please draw a " + label;

    // change label and event (on start btn )
    startBtn.innerHTML="next";
    startBtn.onclick=next;
}

function next() {
    //get paths created from sketchpad??
    if (sketchPad.paths.length === 0) {
        alert("sketchPad is empty\ndraw samething first");
        return;
    }
    //if there is samething on ...
    const label = labels[index];
    data.drawings[label] = sketchPad.paths;
    // the reset the sketckpad after pulling data 
    sketchPad.reset();

    //set next label and instructions
    index++;
    if (index < labels.length) {
        const next_label = labels[index];
        instructionSpan.innerHTML = "Please draw a " + next_label;
    } else {
        container.style.display = "none";
        instructionSpan.innerHTML = "Thank you";
        startBtn.innerHTML = "SAVE";
        startBtn.onclick = save;
    }

    //?? data
    console.log(data);

}

//save data into files;
const save=() => {
    startBtn.style.display = "none";
    instructionSpan.innerHTML = "Take your download file and place it alongside the others in the dataset"
    
    //create a link element to download a file
    const element = document.createElement("a") as HTMLAnchorElement;
    // data is plain text , type utf-8 (for special caracters)
    element.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(JSON.stringify(data)));
    
    const filename = data.session+".json";
    //download file from link (make that link a download link)
    element.setAttribute('download', filename);

    //hide the link element  and the append it to the body
    element.style.display = "none";
    document.body.appendChild(element);
    //?? trigger the click 9automatic click 
    element.click();
    document.body.removeChild(element);

}

startBtn.onclick = () => {
    start();
}