'use strict';

const koa = require('koa');

const router = require('koa-router')();
const koaJsonLogger = require('koa-json-logger');
const config = require('./config');

// Add resources:
require('./resources/disk')(router);
require('./resources/environment')(router);
require('./resources/peer')(router);
require('./resources/postgres')(router);
require('./resources/redis')(router);
require('./resources/root')(router);

// Start server:
const app = koa();
app.use(koaJsonLogger({
  path: null
}));
app.use(router.routes())
  .use(router.allowedMethods());
app.listen(config.PORT);
