'use strict';

require('co-mocha');

const bluebird = require('bluebird');
const request = require('supertest');
bluebird.promisifyAll(request);

const LAIKA_URL = process.env.LAIKA_URL || 'http://localhost:8080';

module.exports = () => request(LAIKA_URL);
