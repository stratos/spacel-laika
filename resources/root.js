'use strict';

const config = require('../config');

module.exports = (router) => {
  router.get('/', function* () {
    this.body = {
      version: config.VERSION
    };
  });
};
