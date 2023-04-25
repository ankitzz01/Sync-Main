import fs from "fs";

export const getAllFiles = (directory: string): string[] => {
    const fileArray: string[] = [];
    const files = fs.readdirSync(directory);

    for (const file of files) {
        if (fs.statSync(`${directory}/${file}`).isDirectory()) fileArray.push(...getAllFiles(`${directory}/${file}`));
        else fileArray.push(`${process.cwd().replace(/\\/g, "/")}/${directory.slice(2)}/${file}`);
    }

    return fileArray;
};