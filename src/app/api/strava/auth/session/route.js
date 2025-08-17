// src/app/api/auth/session/route.js
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';

// This line prevents the route from being cached.
export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { idToken } = await request.json();
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    const isProduction = process.env.NODE_ENV === 'production';
    
    cookies().set('session', sessionCookie, { 
      maxAge: expiresIn, 
      httpOnly: true, 
      secure: isProduction 
    });

    return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
  } catch (error) {
    console.error('Failed to create session:', error);
    return new Response(JSON.stringify({ error: 'Failed to create session' }), { status: 401 });
  }
}

export async function DELETE(request) {
  cookies().delete('session');
  return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
}