// set up visual regression testing
import { setDefaultOptions } from 'jsdom-screenshot';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

// TravisCI and Linux OS require --no-sandbox to be able to run the tests
// https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-on-travis-ci
setDefaultOptions({
  launch: { args: process.env.CI === 'true' ? ['--no-sandbox'] : [] },
});

// give tests more time as taking screenshots takes a while
jest.setTimeout(10000);

expect.extend({ toMatchImageSnapshot });
