const fs = require('fs')
    cheerio = require('cheerio')
    axios = require('axios')

const SEARCH_TERM = process.env.SEARCH_TERM || 'turtles'

//1. fetch the site
function fetchUnsplashData() {
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
function saveImages(images) {
    images.map((index, image) => {
        axios({
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
module.exports = unsplash = () => {
    fetchUnsplashData()
    .then(grabImages)
    .then(saveImages)
    .catch(e => console.log(e.message))
} 