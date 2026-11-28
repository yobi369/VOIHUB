import assert from 'node:assert/strict';
import test from 'node:test';

import { verifyFirebaseIdToken } from '../serverAuth.ts';

const validKey = 'AIzaSyExampleFirebaseWebApiKey123';

test('Firebase token verification returns the verified account identity', async () => {
  let requestedUrl = '';
  let requestedBody = '';

  const identity = await verifyFirebaseIdToken(
    'header.payload.signature-long-enough',
    validKey,
    async (input, init) => {
      requestedUrl = String(input);
      requestedBody = String(init?.body);
      return new Response(
        JSON.stringify({
          users: [{ localId: 'student-123', email: 'student@example.com', emailVerified: true }],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  );

  assert.deepEqual(identity, {
    uid: 'student-123',
    email: 'student@example.com',
    emailVerified: true,
  });
  assert.match(requestedUrl, /identitytoolkit\.googleapis\.com\/v1\/accounts:lookup/);
  assert.match(requestedUrl, /key=AIzaSyExampleFirebaseWebApiKey123/);
  assert.deepEqual(JSON.parse(requestedBody), { idToken: 'header.payload.signature-long-enough' });
});

test('invalid or revoked Firebase credentials are rejected', async () => {
  const identity = await verifyFirebaseIdToken(
    'header.payload.signature-long-enough',
    validKey,
    async () => new Response(JSON.stringify({ error: { message: 'INVALID_ID_TOKEN' } }), { status: 400 })
  );
  assert.equal(identity, null);
});

test('malformed identity responses are rejected', async () => {
  const identity = await verifyFirebaseIdToken(
    'header.payload.signature-long-enough',
    validKey,
    async () => new Response(JSON.stringify({ users: [{ email: 'missing-uid@example.com' }] }), { status: 200 })
  );
  assert.equal(identity, null);
});

test('unverified email status is preserved for the API guard to reject', async () => {
  const identity = await verifyFirebaseIdToken(
    'header.payload.signature-long-enough',
    validKey,
    async () => new Response(JSON.stringify({ users: [{ localId: 'student-456', emailVerified: false }] }), { status: 200 })
  );
  assert.equal(identity?.emailVerified, false);
});

test('short tokens are rejected without making a provider request', async () => {
  let called = false;
  const identity = await verifyFirebaseIdToken('short', validKey, async () => {
    called = true;
    return new Response('{}', { status: 200 });
  });
  assert.equal(identity, null);
  assert.equal(called, false);
});

test('provider failures throw so the API can fail closed', async () => {
  await assert.rejects(
    verifyFirebaseIdToken(
      'header.payload.signature-long-enough',
      validKey,
      async () => new Response('{}', { status: 503 })
    ),
    /HTTP 503/
  );
});

test('missing server API key is treated as a configuration failure', async () => {
  await assert.rejects(
    verifyFirebaseIdToken('header.payload.signature-long-enough', ''),
    /not configured/
  );
});
