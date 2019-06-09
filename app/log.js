const bunyan = require('bunyan');
const log = bunyan.createLogger({
  name: "ad.log",
  streams: [ { path: process.cwd() + '/server-log/ad.log' } ]
});

module.exports = log