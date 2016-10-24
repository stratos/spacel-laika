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

  describe('/counter', () => {
    /**
     * Get counter.
     * @returns {number} Counter value.
     */
    function* counter() {
      const res = yield test()
        .get('/redis/counter')
        .expect(200)
        .expect('Content-Type', /json/);
      return res.body.count;
    }

    it('returns count', function* () {
      const count = yield counter();
      assert.strictEqual('number', typeof count);
    });

    it('increments count', function* () {
      const count = yield counter();

      const res = yield test()
        .post('/redis/counter');
      const incremented = res.body.count;
      assert(incremented > count);
    });
  });
});
