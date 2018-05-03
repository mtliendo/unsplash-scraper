const fs = require('fs')
    cheerio = require('cheerio')
    axios = require('axios')


//1. fetch the site
function fetchUnsplashData(SEARCH_TERM) {
    console.log(`fetching photos for: ${SEARCH_TERM}`)
    return axios.get(`https://unsplash.com/search/photos/${SEARCH_TERM}`)
        .then(res => res.data)
        .catch(e => e.message)
}

//2. grabImages
function grabImages(data) {
    return new Promise((resolve, reject) => {
        if(data) {
            const $ = cheerio.load(data)
            const imageLinks = $('a[title="Download photo"]').map((index, image) => {
                return $(image).attr('href')
            })
            resolve(imageLinks)
        }
    })
}

//3. saveImages
function saveImages(SEARCH_TERM,images) {
    console.log(`saving ${images.length} images...`)
    return images.map((index, image) => {
        return axios({
            method: 'get',
            responseType: 'stream',
            url: image
        }).then((item) => {
            fs.mkdir('unsplash-images', () => {
                item.data.pipe(fs.createWriteStream(`unsplash-images/${SEARCH_TERM}${index}.jpg`))
            })
        })
        .catch(e => e.message)
    })
}

//4. put them all together
module.exports = unsplash = (SEARCH_TERM) => {
    fetchUnsplashData(SEARCH_TERM)
    .then(grabImages)
    .then(saveImages.bind(undefined, SEARCH_TERM))
    .then(() => console.log('Wrapping up now...'))
    .catch(e => console.log(e.message))
} 