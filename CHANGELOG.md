# Changelog

## 2.0.0
Feature: delete multiple documents

Now second `ids` parameter (formally `id`) can be an array of document ids. If so, and array contains more than one document, documents are deleted using bulk api.

### Breaking Change
This changes the response format from
```js
{
  "ok": true,
  "id": "one",
  "rev": "6-cadac9c962554f5007d8f4aded2f2e07"
}
```
to
```js
[
  {
    "ok": true,
    "id": "one",
    "rev": "6-cadac9c962554f5007d8f4aded2f2e07"
  }
]
```
