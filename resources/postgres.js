'use strict';

const pgp = require('pg-promise')();
const sleep = require('es6-sleep').generator;

const config = require('../config');
const COUNTER_NAME = 'counter';
const STARTUP_ERROR = 'the database system is starting up';

module.exports = (router) => {
  if (!config.POSTGRES_URL) {
    return;
  }

  let db;

  /**
   * Get database.
   * @returns {*} Database.
   */
  function* getDb() {
    if (!db) {
      try {
        db = pgp(config.POSTGRES_URL);
        yield db.none('CREATE TABLE IF NOT EXISTS counters (' +
          'count_name VARCHAR(40) NOT NULL PRIMARY KEY, ' +
          'count_value BIGINT NOT NULL DEFAULT 0' +
          ');');
      } catch (e) {
        db = undefined;
        if (e.code !== 'ECONNREFUSED' && e.message !== STARTUP_ERROR) {
          throw e;
        }

        // Connection error, retry:
        yield sleep(100);
        yield getDb();
      }
    }
    return db;
  }

  /**
   * Get counter value.
   */
  router.get('/postgres/counter', function* () {
    const db = yield getDb();
    const res = yield db.oneOrNone('SELECT count_value FROM counters ' +
      'WHERE count_name = $1;', COUNTER_NAME);

    const count = res && parseInt(res.count_value, 10) || 0;
    this.body = { count };
  });

  /**
   * Increment counter value.
   */
  router.post('/postgres/counter', function* () {
    const db = yield getDb();
    const res = yield db.oneOrNone(
      'INSERT INTO counters (count_name, count_value) VALUES ($1, 1)' +
      'ON CONFLICT (count_name) DO UPDATE' +
      '  SET (count_value) = (counters.count_value + 1)' +
      '  WHERE counters.count_name = $1' +
      'RETURNING count_value;',
      COUNTER_NAME);
    this.body = {
      count: parseInt(res.count_value, 10)
    };
  });

  /**
   * Return server's info.
   */
  router.get('/postgres/info', function* () {
    const db = yield getDb();
    const allVars = yield db.many('SHOW ALL;');

    this.body = {};
    allVars.forEach((varEntry) => {
      this.body[varEntry.name] = varEntry.setting;
    });
  });
};
