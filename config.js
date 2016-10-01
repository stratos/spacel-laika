'use strict';

exports.DISK_PATH = process.env.DISK_PATH;
exports.ENVIRONMENT = {
  message: process.env.MESSAGE || '(not found)',
  version: require('./package.json').version
};
exports.PORT = process.env.PORT || 8080;
exports.POSTGRES_URL = process.env.POSTGRES_URL;
exports.REDIS_URL = process.env.REDIS_URL;
