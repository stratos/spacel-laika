'use strict';

const config = require('../config');

module.exports = (router) => {
  /**
   * Return the contents of a environment variables.
   */
  router.get('/environment', function* () {
    this.body = config.ENVIRONMENT;
  });
};
