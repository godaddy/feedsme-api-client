# feedsme-api-client

The `feedsme-api-client` is an API client for the [`feedsme`][feedsme] build service.

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

var Feedsme = require('feedsme-api-client');

var feedsme = new Feedsme('url-to-the-service');
```

As you can see in the example above, the `Feedsme` constructor requires one
argument:

- The URL of the feedsme API where we should send the requests to.

### build

Trigger a new build on feedsme service.

```js
feedsme.change({ data: {
  name: 'name of the module'
}}, function () {

});
```

## Tests

```sh
npm test
```

## License
MIT

[feedsme]: https://github.com/godaddy/feedsme
