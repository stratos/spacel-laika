'use strict';

const test = require('./test');

describe('/peer', () => {
  if (!process.env.LAIKA_PEERS) {
    return;
  }

  const peers = process.env.LAIKA_PEERS.split(',');

  describe('/peer', () => {
    it('returns 404 on missing peer', function* () {
      yield test()
        .get('/peer/does-not-exist')
        .expect(404);
    });
  });

  peers.forEach((peerName) => {
    const peerUrl = `/peer/${peerName}`;
    describe(peerUrl, () => {
      it('returns environment', function* () {
        yield test()
          .get(`${peerUrl}/environment`)
          .expect(200)
          .expect('Content-Type', /json/);
      });

      it('rejects /peer url', function* () {
        yield test()
          .get(`${peerUrl}${peerUrl}/environment`)
          .expect(400);
      });
    });
  });
});
