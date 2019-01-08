'use strict';

var request = require('hyperquest'),
  tryParse = require('json-try-parse'),
  retry = require('retryme'),
  url = require('url'),
  bl = require('bl');

//
// Methods that require an `application/json` header.
//
const methods = ['POST', 'PUT'];

/**
 * Feedsme API client.
 *
 * @constructor
 * @param {Object|String} opts Options for root URL of feedsme service
 * @param {String} opts.url The root URL of the feedsme service
 * @param {String} opts.uri The root URL of the feedsme service
 * @param {String} opts.href The href for root URL of the feedsme service
 * @param {String} opts.protocol Protocol for root URL of the feedsme service
 * @param {String} opts.version Which feedsme api version to use (defaults to v2)
 * @public
 */
function Feedsme(opts) {
  if (!this) new Feedsme(opts); // eslint-disable-line no-new

  if (typeof opts === 'string') {
    this.base = opts;
  } else if (opts.protocol && opts.href) {
    this.base = url.format(opts);
  } else if (opts.url || opts.uri) {
    this.base = opts.url || opts.uri;
  } else {
    throw new Error('Feedsme URL required');
  }

  this.version = (opts.version === '1' || opts.version === 'v1' || opts.version === 1) ? '' : 'v2';

  //
  // Handle all possible cases
  //
  this.base = typeof this.base === 'object'
    ? url.format(this.base)
    : this.base;

  this.agent = opts.agent;
  this.retry = opts.retry;
}

/**
 * Trigger a new build for a given environment
 *
 * @param {String} env Environment we trigger the change for.
 * @param {Object} options Configuration.
 * @param {Function} next Completion callback.
 * @returns {Stream} the request
 * @private
 */
Feedsme.prototype.change = function build(env, options, next) {
  return this.send([this.version, 'change', env].filter(Boolean).join('/'), options, next);
};

/**
 * Internal API for sending data.
 *
 * @param {String} pathname Pathname we need to hit.
 * @param {Object} options Hyperquest options
 * @param {Function} done Completion callback.
 * @api private
 */
Feedsme.prototype.send = function send(pathname, options, done) {
  const base = url.parse(this.base);
  let data = false,
    operation,
    statusCode;

  if (typeof pathname === 'object') {
    options = pathname;
    pathname = null;
  }

  if (typeof options === 'function') {
    done = options;
    options = {};
  }

  options.agent = this.agent;
  options.headers = options.headers || {};
  base.pathname = pathname || options.pathname || '/';

  //
  // Setup options from method and optional data.
  //
  data = options.data;
  if (typeof data === 'object' || ~methods.indexOf(options.method)) {
    delete options.data;

    options.method = options.method || 'POST';
    options.headers['Content-Type'] = 'application/json';
  }

  operation = retry.op(this.retry, (err) => {
    return err.message.includes('404')
      || err.message.includes('400');
  });

  operation.attempt((next) => {
    //
    // Setup hyperquest to formatted URL.
    //
    const req = request(url.format(base), options)
      .on('response', function (res) {
        statusCode = res.statusCode;
      });

    //
    // Write JSON data to the request.
    //
    if (typeof data === 'object') {
      try {
        req.end(JSON.stringify(data));
      } catch (error) {
        return next(error);
      }
    }

    req.pipe(bl(validateBody));

    //
    // If a callback is passed, validate the returned body
    //
    function validateBody(err, body) {
      body = tryParse(body);

      if (err || !body) {
        return next(err || new Error('Unparsable response with statusCode ' + statusCode));
      }

      if (statusCode !== 200) {
        return next(new Error(body.message || 'Invalid status code ' + statusCode));
      }

      next(null, body);
    }
  }, done);

};

//
// Expose the interface.
//
module.exports = Feedsme;
