const axios = require('axios');
const WebServiceClient = require('@maxmind/geoip2-node').WebServiceClient;
const ERRORS = require('./error-code');
const log = require('./log');
const config = require('./config');

const client = new WebServiceClient('141633', 'ZBA9j3SZtdmW');

const getPubliser = siteId => {
  const PUBLISHER_URL = 'http://159.89.185.155:3000/api/publishers/find';
  return axios.post(
    PUBLISHER_URL,
    {
      q: { siteID: siteId }
    },
    {
      headers: { "Content-Type": "application/json" }
    })
  .then(resp => {
    return resp.data;
  }).catch(err => {
    throw ERRORS.error(ERRORS[1005], err);
  });
};

const getDemographics = siteId => {
  const DEMOGRAPHIC_URL = `http://159.89.185.155:3000/api/sites/${siteId}/demographics`;
  return axios.get(DEMOGRAPHIC_URL)
    .then(resp => {
      const female_percent = Math.round(resp.data.demographics.pct_female);
      const male_percent = 100 - female_percent;
      return { female_percent, male_percent };
    })
    .catch(err => {
      // log erro, then service degradation
      log.error(err.message);
      return null;
    });
}

const getCountry = ip => {
  return client.country(ip)
    .then(resp => {
      return resp.country.isoCode;
    })
    .catch(err => {
      throw ERRORS.error(ERRORS[1002], err);
  });
}

const enrichAd = async (siteId, ip) => {
  const body = {};

  if (config.country) {
    const country = await getCountry(ip);
    if (country != 'US') {
      throw ERRORS.error(ERRORS[1001]);
    }
    body.geo = { country };
  }

  const fns = [];
  if (config.publisher) {
    fns.push(() => { return getPubliser(siteId); });
  }
  if (config.demographics) {
    fns.push(() => { return getDemographics(siteId); });
  }

  let rs = await Promise.all(
    fns.map(async fn => { return await fn(); }))

  if (config.publisher) {
    const pub = rs[0];
    if (!pub || !pub.publisher || !pub.publisher.id) {
      throw ERRORS.error(ERRORS[1006]);
    }
    Object.assign(body, pub);
  }

  if (config.demographics) {
    body.demographics= rs[rs.length -1];
  }
  return body;
}

module.exports = { enrichAd };

