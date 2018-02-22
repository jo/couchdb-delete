#!/usr/bin/env node

const deleteDocs = require('./')

const args = process.argv.slice(2)

if (args.length < 2) {
  console.log('Usage: \ncouchdb-delete URL ID')
  process.exit()
}

const url = args.shift()
const ids = args

deleteDocs(url, ids, (error, response) => {
  if (error) return console.error(error)

  console.log(JSON.stringify(response, null, '  '))
})
