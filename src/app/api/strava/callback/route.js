// src/app/api/strava/callback/route.js
import { cookies } from 'next/headers';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

// This line prevents the route from being cached.
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const scope = searchParams.get('scope');

  if (!code) {
    return new Response(JSON.stringify({ error: 'No code provided' }), { status: 400 });
  }

  const sessionCookie = cookies().get('session')?.value || '';
  if (!sessionCookie) {
    console.error("Callback error: No session cookie found. User is not logged in.");
    return new Response(null, {
      status: 302,
      headers: { 'Location': '/settings?strava-connected=false&error=no_session' },
    });
  }

  try {
    const decodedIdToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userId = decodedIdToken.uid;

    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.errors) throw new Error(JSON.stringify(tokenData.errors));

    const userDocRef = adminDb.collection('users').doc(userId);
    await userDocRef.update({
      strava: {
        athleteId: tokenData.athlete.id,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: tokenData.expires_at,
        scope: scope,
      },
    });

    return new Response(null, {
      status: 302,
      headers: { 'Location': '/settings?strava-connected=true' },
    });

  } catch (error) {
    console.error('Strava callback error:', error);
    return new Response(null, {
      status: 302,
      headers: { 'Location': '/settings?strava-connected=false&error=token_exchange_failed' },
    });
  }
}