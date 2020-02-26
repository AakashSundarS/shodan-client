/*
  Copyright Jesús Rubio <jesusprubio@gmail.com>

  This code may only be used under the MIT license found at
  https://opensource.org/licenses/MIT.
*/

/* eslint-disable no-console */

'use strict';

const assert = require('assert');

const client = require('../..');
const utilsTest = require('../utils');

let apiKey;
if (process.env.KEY_TEST) {
  apiKey = process.env.KEY_TEST;
}

describe('count', () => {
  it('should fail if "query" parameter no present', async () =>
    utilsTest.throwsAsync(() => client.count(), /Required parameter: query/));

  it('should fail if "key" parameter no present', async () =>
    utilsTest.throwsAsync(
      () => client.count('asterisk'),
      /You must provide a valid API key/,
    ));

  it('should fail if the HTTP request fails', async function t() {
    utilsTest.insist(this);
    utilsTest.throwsAsync(
      () => client.count('asterisk', 'a'),
      /got.get : Response code 401/,
    );
  });

  it('should have into account the "timeout" option', async function t() {
    utilsTest.insist(this);
    utilsTest.throwsAsync(
      () => client.count('asterisk', 'a', { timeout: 1 }),
      /got.get : Timeout awaiting/,
    );
  });

  it('should return a lot for a common service', async function t() {
    if (!apiKey) {
      this.skip();
    }
    utilsTest.insist(this);

    const res = await client.count('asterisk', apiKey);

    assert.deepEqual(res.matches, []);
    assert.ok(res.total > 10);
  });

  it('should return 0 for a non existent service', async function t() {
    if (!apiKey) {
      this.skip();
    }
    utilsTest.insist(this);

    const res = await client.count('nonexistentservice', apiKey);

    assert.deepEqual(res.matches, []);
    assert.equal(res.total, 0);
  });
});
