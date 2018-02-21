# CouchDB Delete
Delete CouchDB document

## API

```js
deleteDoc(url, id[, options], callback)
```

* `url` - CouchDB database URL
* `id` -  Document ID
* `callback` - called when done with a `response` object describing the status of all operations.

### Example

```js
var deleteDoc = require('couchdb-delete')
deleteDoc('http://localhost:5984/mydb', '_design/myapp', function(error, response) {
  // here we go
})
```

## CLI

```sh
couchdb-delete URL ID
```

### Example
```sh
couchdb-delete http://localhost:5984/mydb _design/myapp
```

## Tests
```sh
npm test
```


(c) 2018 Johannes J. Schmidt, licensed under Apache-2.0
