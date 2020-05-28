const imageDownloader = require('image-downloader')
const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const state = require('./state.js')
const fs = require('fs')

const googleCredentials = require('../credentials/google-search.json')

async function robot(){
    const content = state.load()
    
    state.clearFolder()

    await fetchImagesOfAllSentences(content)
    await downloadAllImages(content)
    
    state.save(content)

    async function fetchImagesOfAllSentences(content){
        for(const sentence of content.sentences) {
            for(let keywordIndex = 0; keywordIndex < sentence.keywords.length; keywordIndex++){
                const query = `${content.searchTerm} ${sentence.keywords[keywordIndex]}`
                const sentenceImages = await fetchGoogleAndReturnImagesLinks(query)
                if(sentenceImages !== undefined){
                    sentence.images = sentenceImages
                    sentence.googleSearchQuery = query
                    break
                }
            }
        }
    }

    async function fetchGoogleAndReturnImagesLinks(query){
        const response = await customSearch.cse.list({
            auth: googleCredentials.apiKey,
            cx: googleCredentials.searchEngineId,
            q: query,
            searchType: "image",
            num: 9
        })
        
        if(response.data.items !== undefined){
            return response.data.items.map((item) => {return item.link})
        }
    }

    async function downloadAllImages(content){
        content.downloadedImages = []

        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++){
            const images = content.sentences[sentenceIndex].images

            if(images != undefined){
                for (let imageIndex = 0; imageIndex < images.length; imageIndex++){
                    const imageUrl = images[imageIndex]
    
                    try{
                        if(content.downloadedImages.includes(imageUrl)){
                            throw new Error('> Imagem já foi baixada.')
                        }
                        
                        await downloadAndSave(imageUrl, `${sentenceIndex}-original.png`)
                        content.downloadedImages.push(imageUrl)

                        console.log(`> Sucesso ao baixar ${imageUrl}`)
                        break
                    }catch(error){
                        console.log(`> Erro ao baixar ${imageUrl}: ${error}`)
                    }
                }
            }
        }
    }

    async function downloadAndSave(url, fileName){
        return imageDownloader.image({
            url: url,
            dest: `./content/${fileName}`
        })
    }

}

module.exports = robot