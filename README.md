#### Required Runtime
* Linux (developed and tested under ubuntu 18.04.2 LTS)
* nodejs (developed and tested against v10.15.1)
* Make sure server-log directory existed, otherwise create this directory under root directory first
* exposed api endpoints
  1. http://localhost:3000/api/v0/ad
  2. http://localhost:3000/config

#### Support Features
1. Inject demographics, publisher, and country origin.
2. Latency < 500ms.
3. Automated tests to demostrate corrects.
4. How fast you made end-to-end execution ?
   * about 300ms. See below Run the App in PROD mode for result.
   * For best performance and meet the requirements, first load publisher asynchronosly, then load demographics and country in parallel asynchronosly. Finally merge the 3 data sources.
   * using time curl command to get a end-to-end performance. See below section.

5. Ensure can hanlde average 50 requests/second over a period of time.
   * Yes. Supported. see load testing section for instruction and result.

6. If requst is from outside US, then about the calling internal service.
   * Yes. Supported, see enrichAd function in services.js

7. If publisher is not available, then abort the transaction.
   * Yes. Supported. see enrichAd function in services.js

8. Allow individual processing to be installed/uninstalled at runtime.
   * Yes. supported. Run following curl command to dynamically enable/disable.
```
curl -XPOST 'http://localhost:3000/config' -H 'Content-Type: application/json' -d \
'{"country": false, "publisher": true, "demographics": true}'
```
6. Enable application fault tolerant.
   * Yes. Supported.

#### Run the App in Dev mode
```
npm run dev

```

#### Run the App in PROD mode
```
* cmd to run:
npm run prod

* curl cmd for testing
time curl -XPOST 'http://localhost:3000/api/v0/ad' -H 'Content-Type: application/json' -d '{"site": {"id": "foo123", "page": "http://www.foo.com/why-from"},"device": {"ip": "69.250.196.118"},"user": {"id": "9cb89r"}}'

{"site":{"id":"foo123","page":"http://www.foo.com/why-from","demographics":{"female_percent":49,"male_percent":51},"publisher":{"id":"ksjdf9325","name":"ACME Inc."}},"device":{"ip":"69.250.196.118","geo":{"country":"US"}},"user":{"id":"9cb89r"}}
real	0m0.273s
user	0m0.005s
sys	0m0.006s

* prefomrnace:
For single request, it is about 0.3s.
```

#### Automated End-To-End Test
```
npm run test

```

#### Load Test
```
* cmd to run load test:
1. first start the app
npm run prod

2. then run load test
npm run load-test

3. Load test result
average latency: about 400 ms.

npm run load-test
> ad@1.0.0 load-test /home/dad/dev/js/ad1
> node ./app/load-test.js

{ title: undefined,
  url: 'http://localhost:3000/api/v0/ad',
  socketPath: undefined,
  requests:
   { average: 100.5,
     mean: 100.5,
     stddev: 27.5,
     min: 73,
     max: 128,
     total: 201,
     p0_001: 73,
     p0_01: 73,
     p0_1: 73,
     p1: 73,
     p2_5: 73,
     p10: 73,
     p25: 73,
     p50: 73,
     p75: 128,
     p90: 128,
     p97_5: 128,
     p99: 128,
     p99_9: 128,
     p99_99: 128,
     p99_999: 128,
     sent: 251 },
  latency:
   { average: 411.78,
     mean: 411.78,
     stddev: 152.37,
     min: 230,
     max: 713.477173,
     p0_001: 230,
     p0_01: 230,
     p0_1: 230,
     p1: 255,
     p2_5: 263,
     p10: 286,
     p25: 308,
     p50: 341,
     p75: 443,
     p90: 679,
     p97_5: 704,
     p99: 708,
     p99_9: 713,
     p99_99: 713,
     p99_999: 713 },
  throughput:
   { average: 37428,
     mean: 37428,
     stddev: 9852,
     min: 27569,
     max: 47294,
     total: 74863,
     p0_001: 27583,
     p0_01: 27583,
     p0_1: 27583,
     p1: 27583,
     p2_5: 27583,
     p10: 27583,
     p25: 27583,
     p50: 27583,
     p75: 47295,
     p90: 47295,
     p97_5: 47295,
     p99: 47295,
     p99_9: 47295,
     p99_99: 47295,
     p99_999: 47295 },
  errors: 0,
  timeouts: 0,
  duration: 2.06,
  start: 2019-06-09T13:56:33.065Z,
  finish: 2019-06-09T13:56:35.126Z,
  connections: 50,
  pipelining: 1,
  non2xx: 18,
  '1xx': 0,
  '2xx': 183,
  '3xx': 0,
  '4xx': 0,
  '5xx': 18 }

```