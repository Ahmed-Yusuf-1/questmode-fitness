export const dynamic = 'force-dynamic';

export async function GET(request) {
  const stravaAuthUrl = 'https://www.strava.com/oauth/authorize';
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const redirectUri = 'http://localhost:3000/api/strava/callback';
  const scope = 'read,activity:read';
  const authUrl = `${stravaAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  
  return new Response(null, {
    status: 302,
    headers: { 'Location': authUrl },
  });
}