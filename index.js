const nanoOption = require('nano-option')
const ensure = require('couchdb-ensure')

module.exports = function deleteDoc (url, id, callback) {
  const db = nanoOption(url)
  const couch = nanoOption(db.config.url)

  db.head(id, (error, _, headers) => {
    if (error) return callback(error)

    const rev = JSON.parse(headers.etag)
    
    db.destroy(id, rev, callback)
  })
}
