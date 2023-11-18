import { SampleType } from "../../common/js_object/samples";
import { utils } from "../../common/utils";

export const createRow = (container:HTMLElement, studentName: string, samples:SampleType[]) => {
    const row = document.createElement('div') as HTMLDivElement;
    row.classList.add('row');
    //append to container
    container.appendChild(row);

    const rowLabel = document.createElement('div');
    rowLabel.innerHTML = studentName;
    rowLabel.classList.add('rowLabel');
    row.appendChild(rowLabel);

    for (let sample of samples) {
        const { id, label,student_id } = sample;

        //container
        const sampleContainer = document.createElement('div') as HTMLDivElement;
        sampleContainer.id = `sample_${id}`;
        sampleContainer.classList.add("sampleContainer");

        //label
        const sampleLabel = document.createElement('div') as HTMLDivElement;
        sampleLabel.innerHTML = label;

        sampleContainer.appendChild(sampleLabel);

        //img
        const img = document.createElement('img') as HTMLImageElement;
        img.src = '/src/data/dataset/img' + `/${id}.png`;
        img.classList.add('thumb');

        //add styles for flagged users
        if (utils.flaggedUsers.includes(student_id)) {
            img.classList.add('blur');
        }

        sampleContainer.appendChild(img);
        //append to row
        row.appendChild(sampleContainer);
    }

}