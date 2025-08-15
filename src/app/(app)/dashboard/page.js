// src/app/(app)/dashboard/page.js
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DashboardPage() {
  const { user } = useAuth(); // We can assume user exists because of the layout
  const [profile, setProfile] = useState(null);

  // Fetch user profile data from Firestore
  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
        if (doc.exists()) {
          setProfile(doc.data());
        } else {
          console.log("No such document for user!");
        }
      });
      return () => unsub(); // Cleanup listener
    }
  }, [user]);

  if (!profile) {
    return <div className="text-center text-text-secondary">Loading profile...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Welcome, {profile.avatarName}!</h2>
      <div className="bg-primary-bg p-4 rounded-lg space-y-2">
        <p className="font-bold text-lg text-accent">Level: {profile.level}</p>
        <div>
          <label className="text-sm text-text-secondary">XP</label>
          <div className="w-full bg-tertiary-bg rounded-full h-4">
             {/* We'll make this a real progress bar later */}
            <div className="bg-accent h-4 rounded-full" style={{ width: `${profile.xp}%` }}></div>
          </div>
          <p className="text-right text-sm text-text-secondary">{profile.xp} / 100</p>
        </div>
      </div>
    </div>
  );
}
