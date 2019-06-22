const Koa = require('koa');
const logger = require('koa-logger');
const http = require('http');
const destroyable = require('server-destroy');
const router = require('./routes');
const log = require('./log');

const PORT = 3000;
const app = new Koa();

// take care of 404, 500 and other uncaught exceptions
app.use(async(ctx, next) => {
  try {
    await next();
    const status = ctx.status || 404;
    if (status === 404) {
      ctx.status = 404;
      ctx.body = { error: 'Not found.', status: ctx.status };
    }
  } catch (err) {
    log.error(err.message);
    ctx.status = err.status || 500
    ctx.body = {
      error: ctx.status == 500 ? 'Internal server error' : err.messge,
      status: ctx.status
    };
  }
})

app.use(router.routes());
app.use(logger());

server = http.createServer(app.callback()).listen(PORT);
destroyable(server);

module.exports = server;
