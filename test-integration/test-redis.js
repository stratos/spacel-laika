'use strict';

const assert = require('assert');

const config = require('../config');
const test = require('./test');

describe('/redis', () => {
  if (!config.REDIS_URL) {
    return;
  }

  describe('/info', () => {
    it('returns info', function* () {
      const info = yield test()
        .get('/redis/info')
        .expect(200)
        .expect('Content-Type', /json/);
      assert.strictEqual('string', typeof info.body.redis_version);
    });
  });
});
