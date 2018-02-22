const nanoOption = require('nano-option')

module.exports = function deleteDocs (url, ids, callback) {
  const db = nanoOption(url)

  if (ids && !Array.isArray(ids)) {
    ids = [ids]
  }

  if (!ids || !ids.length) throw (new Error('Missing required ids!'))

  if (ids.length === 1) {
    return db.head(ids[0], (error, _, headers) => {
      if (error) return callback(error)

      const rev = JSON.parse(headers.etag)
      
      return db.destroy(ids[0], rev, (error, response) => {
        if (error) return callback(error)

        callback(null, [response])
      })
    })
  }
    
  db.fetchRevs({ keys: ids }, (error, response) => {
    if (error) return callback(error)

    const docs = response.rows
      .filter(row => !row.error)
      .map(row => {
        return {
          _id: row.id,
          _rev: row.value.rev,
          _deleted: true
        }
      })

    return db.bulk({ docs }, (error, responses) => {
      if (error) return callback(error)

      const fullResponse = ids.map(id => {
        const response = responses.find(r => r.id === id)

        if (response) return response

        return {
          id,
          ok: false,
          missing: true
        }
      })

      callback(null, fullResponse)
    })
  })
}
