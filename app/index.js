const Koa = require('koa');
const logger = require('koa-logger');
const http = require('http');
const destroyable = require('server-destroy');
const router = require('./routes');
const log = require('./log');

const PORT = 3000;
const app = new Koa();
app.use(router.routes());
app.use(logger());

app.on('error', (err, ctx) => {
  log.error(err.message);
  ctx.status = 500;
  ctx.body = { error: err.message, status: ctx.status };
});

server = http.createServer(app.callback()).listen(PORT);
destroyable(server);

module.exports = server;
