import { cookies } from 'next/headers';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

async function refreshStravaToken(userDocRef, currentStravaData) {
  console.log('Refreshing Strava token...');
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: currentStravaData.refreshToken,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error('Failed to refresh Strava token');
  }

  const newStravaData = {
    ...currentStravaData,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_at,
  };

  await userDocRef.update({ strava: newStravaData });
  console.log('Strava token refreshed and updated.');
  return newStravaData.accessToken;
}


export async function POST(request) {
  const sessionCookie = cookies().get('session')?.value || '';
  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const decodedIdToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userId = decodedIdToken.uid;

    const userDocRef = adminDb.collection('users').doc(userId);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const userData = userDoc.data();
    const { activeQuestId, strava } = userData;

    if (!activeQuestId || !strava) {
      return new Response(JSON.stringify({ message: 'No active quest or Strava connection.' }), { status: 200 });
    }

    let accessToken = strava.accessToken;
    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (strava.expiresAt < nowInSeconds) {
      accessToken = await refreshStravaToken(userDocRef, strava);
    }

    const stravaResponse = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=1', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    if (!stravaResponse.ok) throw new Error('Failed to fetch from Strava');
    const activities = await stravaResponse.json();
    if (activities.length === 0) {
      return new Response(JSON.stringify({ message: 'No new activities found.' }), { status: 200 });
    }
    const latestActivity = activities[0];

    const questDoc = await adminDb.collection('quests').doc(activeQuestId).get();
    if (!questDoc.exists) throw new Error('Active quest not found');
    const questData = questDoc.data();

    let questCompleted = false;
    if (latestActivity.type === questData.type) {
      if (questData.type === 'Walk' || questData.type === 'Run') {
        if (latestActivity.distance >= questData.goal) questCompleted = true;
      } else if (questData.type === 'Ride') {
        if (latestActivity.moving_time >= questData.goal) questCompleted = true;
      }
    }

    if (questCompleted) {
      const newXp = (userData.xp || 0) + questData.xp;
      const newLevel = newXp >= 100 ? (userData.level || 1) + 1 : (userData.level || 1);
      const xpAfterLevelUp = newXp >= 100 ? newXp - 100 : newXp;

      await userDocRef.update({
        activeQuestId: null, 
        xp: xpAfterLevelUp,
        level: newLevel,
      });

      return new Response(JSON.stringify({ message: `Quest "${questData.title}" completed! You earned ${questData.xp} XP!` }), { status: 200 });
    }

    return new Response(JSON.stringify({ message: 'Latest activity does not match quest criteria.' }), { status: 200 });

  } catch (error) {
    console.error('Sync error:', error);
    return new Response(JSON.stringify({ error: 'An error occurred during sync.' }), { status: 500 });
  }
}