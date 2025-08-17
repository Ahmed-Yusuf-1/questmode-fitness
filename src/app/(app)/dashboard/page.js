// src/app/(app)/dashboard/page.js
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import QuestCard from '@/components/QuestCard';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [activeQuest, setActiveQuest] = useState(null);

  useEffect(() => {
    // THIS IS THE FIX:
    // If the user object is not available, do nothing.
    // This prevents an error when logging out.
    if (!user) return;

    // --- Listener for the user's profile document ---
    const unsubProfile = onSnapshot(doc(db, "users", user.uid), (profileDoc) => {
      if (profileDoc.exists()) {
        const profileData = profileDoc.data();
        setProfile(profileData);

        // --- Logic to fetch the active quest ---
        if (profileData.activeQuestId) {
          const questDocRef = doc(db, "quests", profileData.activeQuestId);
          const unsubQuest = onSnapshot(questDocRef, (questDoc) => {
            if (questDoc.exists()) {
              setActiveQuest({ id: questDoc.id, ...questDoc.data() });
            } else {
              setActiveQuest(null);
            }
          });
          return () => unsubQuest(); // Cleanup quest listener
        } else {
          setActiveQuest(null);
        }
      } else {
        console.error("User document not found!");
      }
    });
    return () => unsubProfile(); // Cleanup profile listener
  }, [user]); // The effect depends on the user object

  // Show a loading state until the profile is loaded
  if (!profile) {
    return <div className="text-center text-text-secondary">Loading your adventure...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Welcome, {profile.avatarName}!</h2>
        <div className="bg-primary-bg p-4 mt-2 rounded-lg space-y-2">
          <p className="font-bold text-lg text-accent">Level: {profile.level}</p>
          <div>
            <label className="text-sm text-text-secondary">XP Progress</label>
            <div className="w-full bg-tertiary-bg rounded-full h-4 mt-1">
              <div className="bg-accent h-4 rounded-full" style={{ width: `${profile.xp}%` }}></div>
            </div>
            <p className="text-right text-sm text-text-secondary">{profile.xp} / 100</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Active Quest</h3>
        {activeQuest ? (
          <QuestCard quest={activeQuest} isActive={true} />
        ) : (
          <div className="text-center bg-primary-bg p-6 rounded-lg">
            <p className="text-text-secondary">You have no active quest.</p>
            <Link href="/quests" className="inline-block mt-4 px-4 py-2 font-semibold text-text-primary bg-accent rounded-lg hover:bg-red-500 transition-colors">
              Visit the Quest Board
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}