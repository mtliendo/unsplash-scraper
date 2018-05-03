#!/usr/bin/env node
const argv = require('yargs').argv
const unsplash = require('../app')

if(argv.search) {
    console.log('requesting...')
    unsplash(argv.search)
}else {
    console.log('please enter a "search" parameter. ex: search=cats')
}