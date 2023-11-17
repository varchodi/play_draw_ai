export  const utils = {
    // format the percentage
    formatPercent : (n: number) => {
        return (n * 100).toFixed(2) + "%";
    },

    //printout the process
    printProgrees : (count: number, max: number) => {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);

        //calculate percentage
        const percent = utils.formatPercent(count / max);

        process.stdout.write(count + '/' + max + '(' + percent + ')');
    }
}