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

describe('query', () => {
  it('should fail if "key" parameter no present', async () =>
    utilsTest.throwsAsync(
      () => client.query(),
      /You must provide a valid API key/,
    ));

  it('should fail if the HTTP request fails', async function t() {
    utilsTest.insist(this);
    utilsTest.throwsAsync(() => client.query('a'), /got.get : Response code 401/);
  });

  it('should have into account the "timeout" option', async function t() {
    utilsTest.insist(this);
    utilsTest.throwsAsync(
      () => client.query('a', { timeout: 1 }),
      /got.get : Timeout awaiting/,
    );
  });

  // TODO
  it.skip('should return a list with a valid key, endpoint not working?', async function t() {
    if (!apiKey) {
      this.skip();
    }
    utilsTest.insist(this);

    const res = await client.query(apiKey);

    assert.deepEqual(Object.keys(res), ['total', 'matches']);
    assert.ok(typeof res.matches[0].votes, 'number');
  });
});
