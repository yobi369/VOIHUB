import assert from 'node:assert/strict';
import test from 'node:test';

import {
  cleanText,
  createDailyCap,
  createRateLimiter,
  parseGrade,
  pickOne,
  positiveIntFromEnv,
} from '../serverGuards.ts';

test('parseGrade accepts integer grades 1 through 9', () => {
  for (let grade = 1; grade <= 9; grade += 1) {
    assert.equal(parseGrade(grade), grade);
    assert.equal(parseGrade(String(grade)), grade);
  }
});

test('parseGrade rejects invalid, fractional, and out-of-range values', () => {
  for (const value of [undefined, null, '', ' ', 'abc', 0, 10, -1, 1.5, true]) {
    assert.equal(parseGrade(value), null, `expected ${String(value)} to be rejected`);
  }
});

test('cleanText strips control characters, normalizes whitespace, and enforces limits', () => {
  assert.equal(cleanText('  hello\n\t world  ', 40), 'hello world');
  assert.equal(cleanText('a\u0000b\u001fc', 40), 'a b c');
  assert.equal(cleanText('123456', 4), '1234');
  assert.equal(cleanText(42, 10), '');
});

test('pickOne accepts allow-listed values and falls back for everything else', () => {
  const allowed = ['standard', 'olympiad'] as const;
  assert.equal(pickOne('olympiad', allowed, 'standard'), 'olympiad');
  assert.equal(pickOne('unknown', allowed, 'standard'), 'standard');
  assert.equal(pickOne(null, allowed, 'standard'), 'standard');
});

test('rate limiter enforces a fixed window and resets after expiry', () => {
  let now = 1_000;
  const limiter = createRateLimiter({ windowMs: 10_000, max: 2, now: () => now });

  assert.deepEqual(limiter.check('student-1'), { allowed: true, retryAfterSeconds: 0 });
  assert.deepEqual(limiter.check('student-1'), { allowed: true, retryAfterSeconds: 0 });
  assert.deepEqual(limiter.check('student-1'), { allowed: false, retryAfterSeconds: 10 });
  assert.deepEqual(limiter.check('student-2'), { allowed: true, retryAfterSeconds: 0 });

  now = 11_000;
  assert.deepEqual(limiter.check('student-1'), { allowed: true, retryAfterSeconds: 0 });
});

test('daily cap allows exactly the configured number of calls and resets at UTC midnight', () => {
  let now = Date.UTC(2026, 0, 1, 23, 59, 59);
  const cap = createDailyCap(2, () => now);

  assert.equal(cap.tryConsume(), true);
  assert.equal(cap.tryConsume(), true);
  assert.equal(cap.tryConsume(), false);

  now += 2_000;
  assert.equal(cap.tryConsume(), true);
});

test('positiveIntFromEnv accepts only positive integers', () => {
  assert.equal(positiveIntFromEnv('25', 5), 25);
  assert.equal(positiveIntFromEnv('0', 5), 5);
  assert.equal(positiveIntFromEnv('-2', 5), 5);
  assert.equal(positiveIntFromEnv('2.5', 5), 5);
  assert.equal(positiveIntFromEnv(undefined, 5), 5);
});
