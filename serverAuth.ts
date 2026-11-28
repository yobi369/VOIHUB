export interface FirebaseIdentity {
  uid: string;
  email: string | null;
  emailVerified: boolean;
}

type Fetcher = typeof fetch;

/**
 * Verifies a Firebase ID token against the Firebase Authentication project
 * associated with the supplied Web API key. Invalid credentials return null;
 * transport/provider failures throw so callers can fail closed with 503.
 */
export async function verifyFirebaseIdToken(
  idToken: string,
  webApiKey: string,
  fetcher: Fetcher = fetch
): Promise<FirebaseIdentity | null> {
  if (typeof idToken !== 'string' || idToken.length < 20 || idToken.length > 8192) {
    return null;
  }
  if (!webApiKey || webApiKey.length < 20) {
    throw new Error('Firebase Web API key is not configured.');
  }

  const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(webApiKey)}`;
  const response = await fetcher(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
    signal: AbortSignal.timeout(5000),
  });

  if (response.status === 400 || response.status === 401 || response.status === 403) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Firebase token verification returned HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as {
    users?: Array<{
      localId?: unknown;
      email?: unknown;
      emailVerified?: unknown;
    }>;
  };
  const user = Array.isArray(payload.users) ? payload.users[0] : undefined;
  if (typeof user?.localId !== 'string' || user.localId.length === 0 || user.localId.length > 128) {
    return null;
  }

  return {
    uid: user.localId,
    email: typeof user.email === 'string' ? user.email : null,
    emailVerified: user.emailVerified === true,
  };
}
