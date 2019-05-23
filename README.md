# `feedsme-api-client`

[![Version npm](https://img.shields.io/npm/v/feedsme-api-client.svg?style=flat-square)](https://www.npmjs.com/package/feedsme-api-client)
[![License](https://img.shields.io/npm/l/feedsme-api-client.svg?style=flat-square)](https://github.com/warehouseai/feedsme-api-client/blob/master/LICENSE)
[![npm Downloads](https://img.shields.io/npm/dm/feedsme-api-client.svg?style=flat-square)](https://npmcharts.com/compare/feedsme-api-client?minimal=true)
[![Dependencies](https://img.shields.io/david/warehouseai/feedsme-api-client.svg?style=flat-square)](https://github.com/warehouseai/feedsme-api-client/blob/master/package.json)

The `feedsme-api-client` is an API client for the [`feedsme`][feedsme] build
service.

## Install

Install `feedsme-api-client` from the npm registry:

```
npm install --save feedsme-api-client
```

## API

In all examples we assume that you've already initialized the client as
followed:

```js
'use strict';

const Feedsme = require('feedsme-api-client');

const feedsme = new Feedsme('url-to-the-service');
```

As you can see in the example above, the `Feedsme` constructor requires one
argument:

- The URL of the feedsme API where we should send the requests to.

### build

Trigger a new build on feedsme service.

```js
feedsme.change({
  data: {
    name: 'name of the module'
  }
}, function () {

});
```

## Tests

```sh
npm test
```

[feedsme]: https://github.com/godaddy/feedsme
