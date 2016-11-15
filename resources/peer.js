'use strict';

const bluebird = require('bluebird');
const request = require('superagent');
bluebird.promisifyAll(request);

module.exports = (router) => {
  const PEER_CACHE = {};

  /**
   * Get peer URL.
   * @param {String} name Peer name.
   * @returns {String|undefined} Peer URL.
   */
  function getPeerUrl(name) {
    // Normalize name:
    name = name.toUpperCase();

    // Check cache:
    const cached = PEER_CACHE[name];
    if (cached) {
      return cached;
    }

    // Load, normalize URL:
    let peerUrl = process.env[`LAIKA_PEER_${name}`];
    if (peerUrl && !peerUrl.endsWith('/')) {
      peerUrl += '/';
    }

    // Cache and return:
    PEER_CACHE[name] = peerUrl;
    return peerUrl;
  }

  /**
   * Proxy a response to a configured laika peer.
   */
  router.all(/^\/peer\/([^\/]*)\/(.*)/, function* () {
    // Is there a configured peer with this name?
    const peerUrl = getPeerUrl(this.params[0]);
    if (!peerUrl) {
      return this.throw(404);
    }

    // Parse command to be executed on peer; only 1 hop is allowed.
    const peerCommand = this.params[1];
    if (peerCommand.startsWith('peer')) {
      return this.throw(400);
    }

    const response = yield request(request.method, peerUrl + peerCommand);
    this.body = response.body;
  });
};
