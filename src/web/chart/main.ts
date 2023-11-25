import { Chart } from "./chart";
import "./chart.css";
import { math } from "./math";

//generate same fake data(kinda of cars)
const N = 1000;
const samples: {
  id: number;
  label: "basic" | "sport";
  point: [number, number];
}[] = [];
for (let i = 1; i <= N; i++) {
  const type = Math.random() < 0.5 ? "basic" : "sport";
  const km = math.lerp(3000, 300000, Math.random());
  //   const t = math.invLerp(3000, 300000, km);
  //   const price = math.lerp(9000, 900, t);
  const price =
    math.remap(3000, 300000, 9000, 900, km) +
    math.lerp(-2000, 2000, Math.random()) +
    (type == "basic" ? 0 : 5000);

  samples.push({
    id: i,
    label: type,
    point: [km, price],
  });
}

const options = {
  size: 250,
  axeLabel: ["Kilometers", "price"],
  styles: {
    basic: { color: "gray", text: "🚗" },
    sport: { color: "red", text: "🏎️" },
  },
  icon: "text",
};

const chartContainer = document.getElementById(
  "chartContainer"
) as HTMLDivElement;
//chart init
const chart = new Chart(chartContainer, samples, options);

//?? ----------------------
const dataTable = document.getElementById("dataTable") as HTMLTableElement;
//create table header
const header = dataTable.createTHead();
const tr = header.insertRow();
tr.insertCell().innerHTML = "Id";
tr.insertCell().innerHTML = "Type";
tr.insertCell().innerHTML = "Km";
tr.insertCell().innerHTML = "Price";
//create table body
const body = dataTable.createTBody();
for (const sample of samples) {
  const tr = body.insertRow();
  tr.insertCell().innerHTML = `${sample.id}`;
  tr.insertCell().innerHTML = `${sample.label}`;
  tr.insertCell().innerHTML = `${math.formatnumber(sample.point[0])}`;
  tr.insertCell().innerHTML = `${math.formatnumber(sample.point[1])}`;
}
