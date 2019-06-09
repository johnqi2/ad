const autocannon = require('autocannon')

const stressTest = async () => {
  const result = await autocannon({
    url: 'http://localhost:3000/api/v0/ad',
    connections: 50,
    pipelining: 1,
    duration: 2,
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: '{"site": {"id": "foo123", "page": "http://www.foo.com/why-from"},"device": {"ip": "69.250.196.118"},"user": {"id": "9cb89r"}}'
  })
  console.log(result);
};

stressTest();

