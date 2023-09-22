import './creator.css'

import SketchPad from './sketchPad'

const container =document.getElementById("sketchPadContainer") as HTMLDivElement;
const sketchPad = new SketchPad(container);
