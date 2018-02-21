#!/usr/bin/env node

const deleteDoc = require('./')

const args = process.argv.slice(2)

if (args.length < 2) {
  console.log('Usage: \ncouchdb-delete URL ID')
  process.exit()
}

const url = args[0]
const id = args[1]

deleteDoc(url, id, (error, response) => {
  if (error) return console.error(error)

  console.log(JSON.stringify(response, null, '  '))
})
