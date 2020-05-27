const readline = require('readline-sync')
const state = require('./state.js')
function robot() {
    const content = {
        maximumSentences: 15
    }
    
    content.searchTerm = askAndReturnSearchText()
    content.lang = askAndReturnLanguage()
    content.prefix = askAndReturnPrefix()
    state.save(content)

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
}

module.exports = robot