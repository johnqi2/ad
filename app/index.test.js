const request = require('supertest');
const server = require('./index');

const siteId = "foo123";
const ip = "69.250.196.118";

afterAll(() => {
  server.destroy();
});

describe('advertisement enrichment route test', () => {
  test('/api/v0/ad route test', async () => {
  const response = await request(server)
    .post('/api/v0/ad')
    .send(
      {
        site: {
          id: siteId,
          page: "http://www.foo.com/why-from"
        },
        device: {
          ip: ip
        },
        user: {id: "9cb89r"}
      }
    )
    .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    const body = response.body;
    expect(body.site.id).toBe(siteId);
    expect(body.site.publisher.id).toBe("ksjdf9325");
    expect(body.site.demographics.female_percent).toBe(49);
    expect(body.device.geo.country).toBe("US");
    expect(body.device.ip).toBe(ip);
  });
});