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

test('delete multiple documents', t => {
  const doc1 = {
    _id: 'foo'
  }
  const doc2 = {
    _id: 'bar'
  }

  couch.db.destroy(dbname, () => {
    couch.db.create(dbname, (error) => {
      t.error(error)
      
      db.bulk({docs: [doc1, doc2]}, (error) => {
        t.error(error)
        
        deleteDoc(url + '/' + dbname, [doc1._id, doc2._id], (error, response) => {
          t.error(error, 'no error occured')
          
          t.ok(response[0].ok, 'response 0 is ok')
          t.equal(response[0].id, doc1._id, 'response 0 has correct id')
          t.ok('rev' in response[0], 'response 0 has rev')

          t.ok(response[1].ok, 'response 1 is ok')
          t.equal(response[1].id, doc2._id, 'response 1 has correct id')
          t.ok('rev' in response[1], 'response 1 has rev')
          
          db.head(doc1._id, (error) => {
            t.ok(error, 'no doc found')
            t.equal(error.statusCode, 404, 'error is 404')
            
            db.head(doc2._id, (error) => {
              t.ok(error, 'no doc found')
              t.equal(error.statusCode, 404, 'error is 404')
              t.end()
            })
          })
        })
      })
    })
  })
})

test('delete multiple documents where one is missing', t => {
  const doc1 = {
    _id: 'foo'
  }
  const doc2 = {
    _id: 'bar'
  }

  couch.db.destroy(dbname, () => {
    couch.db.create(dbname, (error) => {
      t.error(error)
      
      db.insert(doc1, (error) => {
        t.error(error)
        
        deleteDoc(url + '/' + dbname, [doc1._id, doc2._id], (error, response) => {
          t.error(error, 'no error occured')

          t.ok(response[0].ok, 'response 0 is ok')
          t.equal(response[0].id, doc1._id, 'response 0 has correct id')
          t.ok('rev' in response[0], 'response 0 has rev')
          
          t.equal(response[1].id, doc2._id, 'response 1 has correct id')
          t.notOk(response[1].ok, 'response 1 is not ok')
          t.ok('missing' in response[1], 'response 1 is missing')
          
          db.head(doc1._id, (error) => {
            t.ok(error, 'no doc found')
            t.equal(error.statusCode, 404, 'error is 404')
            t.end()
          })
        })
      })
    })
  })
})
