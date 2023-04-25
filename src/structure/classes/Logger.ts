import Chalk from "chalk";

export class Logger {
    error(group: string, description: string) {
        return console.log("[ " + getDateInFormat() + " ]" + " | " + Chalk.redBright("[ " + group.toUpperCase() + " ]") + " " + Chalk.red(description));
    }

    debug(group: string, description: string) {
        return console.log("[ " + getDateInFormat() + " ]" + " | " + Chalk.yellowBright("[ " + group.toUpperCase() + " ]") + " " + Chalk.cyanBright(description));
    }

    info(group: string, description: string) {
        return console.log("[ " + getDateInFormat() + " ]" + " | " + Chalk.greenBright("[ " + group.toUpperCase() + " ]") + " " + Chalk.cyanBright(description));
    }

    highlight(text: string, type: "success" | "error") {
        if (type === "success") return Chalk.yellow(text);
        else return Chalk.red(text);
    }
}

function getDateInFormat() {
    function toString(number: number, padLength: number) {
        return number.toString().padStart(padLength, "0");
    }

    const date = new Date();

    const dateTimeNow =
        toString(date.getFullYear(), 4)
        + "/" + toString(date.getMonth() + 1, 2)
        + "/" + toString(date.getDate(), 2)
        + " | " + toString(date.getHours(), 2)
        + ":" + toString(date.getMinutes(), 2)
        + ":" + toString(date.getSeconds(), 2);

    return dateTimeNow;
}