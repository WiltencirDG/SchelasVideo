const readline = require('readline-sync')
const robots = {
    text: require('./robots/text.js')
}

async function start(){
    const content = {
        maximumSentences: 15
    }

    content.searchTerm = askAndReturnSearchText()
    content.lang = askAndReturnLanguage()
    content.prefix = askAndReturnPrefix()

    await robots.text(content)

    function askAndReturnSearchText() {
        return readline.question('Type a Wikipedia search term: ')
    }

    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The history of']
        const selectedPrefixIndex = readline.keyInSelect(prefixes,'Choose one option:')
        const selectedPrefix = prefixes[selectedPrefixIndex]

        return selectedPrefix

    }

    function askAndReturnLanguage(){
        const languages = ['Portugues (Brasil)', 'English', 'Espanol']
        const languagesShort = ['pt', 'en', 'es']
        const selectedLanguageIndex = readline.keyInSelect(languages,"Choose a language: ")
        const selectedLanguageText = languagesShort[selectedLanguageIndex]
        return selectedLanguageText
    }

    console.log(JSON.stringify(content, null, 4))
}

start()