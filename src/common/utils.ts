export const utils = {
  styles: {
    car: { color: "gray", text: "🚗" },
    fish: { color: "red", text: "🐠" },
    house: { color: "yellow", text: "🏠" },
    tree: { color: "green", text: "🌳" },
    bicycle: { color: "cyan", text: "🚲" },
    guitar: { color: "blue", text: "🎸" },
    pencil: { color: "magenta", text: "✏️" },
    clock: { color: "lightgray", text: "🕒" },
  },

  // format the percentage
  formatPercent: (n: number) => {
    return (n * 100).toFixed(2) + "%";
  },
  //users who submit wrong drawings
  flaggedUsers: [1663882102141, 1663900040545, 1664485938220],

  //printout the process
  printProgrees: (count: number, max: number) => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);

    //calculate percentage
    const percent = utils.formatPercent(count / max);

    process.stdout.write(count + "/" + max + "(" + percent + ")");
  },

  //group samples
  groupBy: (objArray: any[], key: string) => {
    const groups: Record<any, any> = {};
    for (let obj of objArray) {
      const val = obj[key];

      if (groups[val] == null) {
        groups[val] = [];
      }
      groups[val].push(obj);
    }

    return groups;
  },
};
