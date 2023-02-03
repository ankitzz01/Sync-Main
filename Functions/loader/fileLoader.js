const { promisify } = require("util")
const { glob } = require("glob")
const PG = promisify(glob)

/**
 * @param {String} folderName
 */
async function loadFiles(folderName) {

    const files = await PG(`${process.cwd().replace(/\\/g, "/")}/${folderName}/*/*.js`)

    files.forEach(file => delete require.cache[require.resolve(file)])

    return files

}

module.exports = { loadFiles }