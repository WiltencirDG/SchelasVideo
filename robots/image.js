const imageDownloader = require('image-downloader')
const google = require('googleapis').google
const pexelsClient = require('node-pexels').Client
const pexelsApiKey = require('../credentials/pexels.json').apiKey
const googleCredentials = require('../credentials/google-search.json')
const customSearch = google.customsearch('v1')
const state = require('./state.js')
const fs = require('fs')
const pexels = new pexelsClient(pexelsApiKey)

async function robot(){
    const content = state.load()
    
    state.clearFolder()

    await fetchImagesOfAllSentences(content)
    await downloadAllImages(content)
    
    state.save(content)

    async function fetchImagesOfAllSentences(content){
        console.log('> Buscando imagens...')
        let query

        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
            for(let keywordIndex = 0; keywordIndex < content.sentences[sentenceIndex].keywords.length; keywordIndex++){

                if (sentenceIndex === 0) {
                query = `${content.searchTerm}`
                } else {
                query = `${content.searchTerm} ${content.sentences[sentenceIndex].keywords[keywordIndex]}`
                }
                
                content.sentences[sentenceIndex].images = await fetchImagesLink(query)
                content.sentences[sentenceIndex].googleSearchQuery = query
            }
        }
    }

    async function fetchImagesLink(query){


        let response = await fetchGoogleAndReturnImagesLinks(query)
            .catch((error) => {
                console.log(`> Erro ao buscar no Google: ${error}`)
            })

        /*response = await fetchPexelsAndReturnImagesLink(query)
            .catch((error) => {
                console.log(`> Erro ao buscar no Pexel: ${error}`)

                console.log(`> Saindo...`)
                process.exit(0)
            })
        */
        return response
    }

    async function fetchPexelsAndReturnImagesLink(query){
        const response = await pexels.search(query, 3, 1)
            .catch((error) => {
               throw new Error(error);
            });

        return response.photos.map((item) => {return item.src.original})
    }

    async function fetchGoogleAndReturnImagesLinks(query){
        const response = await customSearch.cse.list({
            auth: googleCredentials.apiKey,
            cx: googleCredentials.searchEngineId,
            q: query,
            searchType: "image",
            num: 10
        })
        
        if(response.data.items !== undefined){
            return response.data.items.map((item) => {return item.link})
        }
    }

    async function downloadAllImages(content){
        content.downloadedImages = []
        
        let downloadIndex = 0
        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++){
            const images = content.sentences[sentenceIndex].images

            if(images != undefined){
                for (let imageIndex = 0; imageIndex < images.length; imageIndex++){
                    const imageUrl = images[imageIndex]
    
                    try{
                        if(content.downloadedImages.includes(imageUrl)){
                            throw new Error('> Imagem já foi baixada.')
                        }
                        
                        // await downloadAndSave(imageUrl, `${sentenceIndex}-original.png`)
                        await downloadAndSave(imageUrl, `${downloadIndex}-original.png`)
                        content.downloadedImages.push(imageUrl)
                        downloadIndex++

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