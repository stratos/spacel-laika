'use strict';

const assert = require('assert');

const config = require('../config');
const test = require('./test');

describe('/disk', () => {
  if (!config.DISK_PATH) {
    return;
  }

  describe('/counter', () => {
    /**
     * Get counter.
     * @returns {number} Counter value.
     */
    function* counter() {
      const res = yield test()
        .get('/disk/counter')
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
        .post('/disk/counter');
      const incremented = res.body.count;
      assert(incremented > count);
    });
  });
});
