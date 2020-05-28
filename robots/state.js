const fs = require('fs')
const path = require('path')
const contentFilePath = './content.json'
const scriptFilePath = './content/after-effects-script.js'

function save(content){
    const contentString = JSON.stringify(content)
    return fs.writeFileSync(contentFilePath, contentString)
}

function saveScript(content){
    const contentString = JSON.stringify(content)
    const scriptString = `var content = ${contentString}`
    return fs.writeFileSync(scriptFilePath, scriptString)
}

function load(){
    const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8')
    const contentJson = JSON.parse(fileBuffer)
    return contentJson
}

function clearFolder(){
    const directory = './content';

    fs.readdir(directory, (error, files) => {
        if (error){
            throw error;
        }        

        for (const file of files) {
            fs.unlink(path.join(directory, file), error => {
                if (error){
                    throw error;
                }
            })
        }
    })
}

module.exports = {
    save,
    saveScript,
    load,
    clearFolder
}