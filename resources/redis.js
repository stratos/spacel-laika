'use strict';

const bluebird = require('bluebird');
const redis = require('redis');

const config = require('../config');

bluebird.promisifyAll(redis.RedisClient.prototype);

const REDIS_TIMEOUT = 1000;
const REDIS_BACKOFF = 100;

module.exports = (router) => {
  if (!config.REDIS_URL) {
    return;
  }

  let client;

  /**
   * Return a client.
   * @returns {RedisClient} Client.
   */
  function getClient() {
    if (!client) {
      client = redis.createClient({
        url: config.REDIS_URL,
        retry_strategy: (options) => {
          if (options.total_retry_time > REDIS_TIMEOUT) {
            client = null;
            return undefined;
          }
          return Math.pow(2, options.attempt) * REDIS_BACKOFF;
        }
      });
    }
    return client;
  }

  /**
   * Return server's info.
   */
  router.get('/redis/info', function* () {
    let info;
    try {
      info = yield getClient().infoAsync();
    } catch (e) {
      return this.throw(503);
    }

    this.body = {};
    info.split('\n').forEach((infoEntry) => {
      const infoSplit = infoEntry.split(':');
      if (infoSplit.length !== 2) return;
      this.body[infoSplit[0]] = infoSplit[1].trim();
    });
  });
};
