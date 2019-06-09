const Router = require('koa-router');
const koaBody = require('koa-body');
const ERRORS = require('./error-code');
const log = require('./log');
const config = require('./config');
const validators = require('./validators');

const router = new Router();
const services = require("./services");

router.post('/config', koaBody(), async (ctx, next) => {
  try {
    Object.assign(config, body);
    ctx.body = {
      message: 'config updated.',
      status: 200
    };
  } catch (err) {
    error(err, ctx);
  }
  await next();
});

router.post('/api/v0/ad', koaBody(), async (ctx, next) => {
  const body = ctx.request.body;
  const invalid = validators.isInvalidAd(body);
  if (invalid) {
    ctx.body = {
      error: invalid,
      status: 400,
    }
    ctx.status = ctx.body.status;
  } else {
    try {
      const reqBody = ctx.request.body;
      const rs = await(services.enrichAd(reqBody.site.id, reqBody.device.ip))
      const body = { ...reqBody };
      body.site.demographics = rs.demographics;
      body.site.publisher = rs.publisher;
      body.device.geo = rs.geo;
      ctx.body = body;
    } catch (err) {
      error(err, ctx);
    }
    await next();
  }

});

const error = (err, ctx) => {
  const ex = err.exception ? err.exception : "";
  log.error(err.message + ex);
  if (err && err.status) {
    ctx.body = {
      error: err.message,
      status: err.status
    };
    ctx.status = err.status;
  } else {
    ctx.body = {
      error: err.message,
      status: 500
    };
    ctx.status = ctx.body.status;
  }
}

module.exports = router;