// src/app/(app)/settings/page.js
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { LogOutIcon } from '@/components/Icons';

const StravaIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="#fc4c02" d="M183.384 319.538l-38.384 76.769h-55l93.384-186.769 93.385 186.769h-55l-38.385-76.769zM384 209.538l-55.385 110.769h-55l110.385-220.769 110.384 220.769h-55z"/></svg> );

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
        setProfile(doc.data());
      });
      return () => unsub();
    }
  }, [user]);

  useEffect(() => {
    if (searchParams.get('strava-connected') === 'true') {
      setMessage('Successfully connected to Strava!');
    } else if (searchParams.get('strava-connected') === 'false') {
      setMessage('Failed to connect to Strava. Please try again.');
    }
  }, [searchParams]);

  const handleSignOut = async () => {
    await signOut(auth);
    // Also need to clear the session cookie
    await fetch('/api/auth/session', { method: 'DELETE' });
    router.push('/login');
  };

  const handleConnectStrava = () => {
    // THIS IS THE FIX: Use a full page redirect
    window.location.href = '/api/auth';
  };
  
  const handleDisconnectStrava = async () => {
    if(user) {
      await updateDoc(doc(db, "users", user.uid), {
        strava: null
      });
      setMessage('Disconnected from Strava.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      
      {message && <p className="mb-4 text-center text-accent">{message}</p>}

      <div className="bg-primary-bg p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Connections</h3>
        {profile?.strava ? (
          <div className="text-center">
            <p className="text-green-400">Connected to Strava</p>
            <button onClick={handleDisconnectStrava} className="text-sm text-danger mt-2">Disconnect</button>
          </div>
        ) : (
          <button 
            onClick={handleConnectStrava}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-[#fc4c02] rounded-lg hover:bg-orange-600 transition-colors"
          >
            <StravaIcon />
            Connect with Strava
          </button>
        )}
      </div>

      <div className="mt-8">
        <h3 className="font-semibold mb-2">Account</h3>
        <button 
          onClick={handleSignOut} 
          className="flex items-center gap-2 px-4 py-2 font-semibold text-text-primary bg-danger rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOutIcon className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}