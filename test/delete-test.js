const test = require('tap').test
const nano = require('nano')
const path = require('path')

const deleteDoc = require('../')

const url = process.env.COUCH || 'http://localhost:5984'
const dbname = 'couchdb-create-index-test'
const couch = nano(url)
const db = couch.use(dbname)

test('delete a document', t => {
  const doc = {
    _id: 'foo'
  }

  couch.db.destroy(dbname, () => {
    couch.db.create(dbname, (error) => {
      t.error(error)
      
      db.insert(doc, (error) => {
        t.error(error)
        
        deleteDoc(url + '/' + dbname, doc._id, (error, response) => {
          t.error(error, 'no error occured')
          t.ok(response[0].ok, 'response is ok')
          t.equal(response[0].id, doc._id, 'response has correct id')
          t.ok('rev' in response[0], 'response has rev')
          
          db.head(doc._id, (error) => {
            t.ok(error, 'no doc found')
            t.equal(error.statusCode, 404, 'error is 404')
            t.end()
          })
        })
      })
    })
  })
})
