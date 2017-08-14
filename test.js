describe('feedsme-api-client', function () {
  'use strict';

  var assume = require('assume'),
    Feedsme = require('./'),
    nock = require('nock'),
    http = require('http'),
    url = require('url');
  var feedsme, uri;

  beforeEach(function each() {
    uri = 'http://localhost:1212/';
    feedsme = new Feedsme(uri);
  });

  afterEach(function each() {
    feedsme = null;
  });

  it('can be configured with object', function () {
    feedsme = new Feedsme(url.parse(uri));

    assume(feedsme.base).to.be.an('string');
    assume(feedsme.base).to.equal(uri);
  });

  it('can be configured with an agent', function () {
    feedsme = new Feedsme({
      uri: uri,
      agent: new http.Agent()
    });

    assume(feedsme.agent).is.instanceof(require('http').Agent);
    assume(feedsme.base).equals(uri);
  });

  describe('#change', function () {
    it('sends a request to /change/dev ', function (next) {
      next = assume.wait(2, next);

      nock(uri)
        .post('/change/dev')
        .reply(200, function reply(uri, body) {
          body = JSON.parse(body);

          assume(body.name).equals('foo-bar');
          nock.cleanAll();
          next();

          return {};
        });

      feedsme.change('dev', {
        data: {
          name: 'foo-bar'
        }
      }, next);
    });
  });
});
