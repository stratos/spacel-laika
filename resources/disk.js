'use strict';

const bluebird = require('bluebird');
const fs = require('fs');

const readFile = bluebird.promisify(fs.readFile);
const writeFile = bluebird.promisify(fs.writeFile);

const config = require('../config');

module.exports = (router) => {
  if (!config.DISK_PATH) {
    return;
  }

  /**
   * Load counter from disk.
   * @returns {number} Counter value.
   */
  function* loadCounter() {
    try {
      const fileData = yield readFile(config.DISK_PATH, 'utf-8');
      return parseInt(fileData, 10);
    } catch (e) {
      if (e.code === 'ENOENT') {
        return 0;
      }
      throw e;
    }
  }

  /**
   * Get counter value.
   */
  router.get('/disk/counter', function* () {
    this.body = yield {
      count: loadCounter()
    };
  });

  /**
   * Increment counter value.
   */
  router.post('/disk/counter', function* () {
    let counter = yield loadCounter();
    counter++;
    yield writeFile(config.DISK_PATH, counter);
    this.body = {
      count: counter
    };
  });
};
