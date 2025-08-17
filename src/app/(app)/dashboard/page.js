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
  const [syncMessage, setSyncMessage] = useState(''); 
  const [isSyncing, setIsSyncing] = useState(false);  

  useEffect(() => {
    if (!user) return;

    const unsubProfile = onSnapshot(doc(db, "users", user.uid), (profileDoc) => {
      if (profileDoc.exists()) {
        const profileData = profileDoc.data();
        setProfile(profileData);

        if (profileData.activeQuestId) {
          const questDocRef = doc(db, "quests", profileData.activeQuestId);
          const unsubQuest = onSnapshot(questDocRef, (questDoc) => {
            setActiveQuest(questDoc.exists() ? { id: questDoc.id, ...questDoc.data() } : null);
          });
          return () => unsubQuest();
        } else {
          setActiveQuest(null);
        }
      } else {
        console.error("User document not found!");
      }
    });

    return () => unsubProfile();
  }, [user]);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMessage('Checking for new activities...');
    try {
      const response = await fetch('/api/strava/sync', { method: 'POST' });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Sync failed');
      }

      setSyncMessage(data.message);
    } catch (error) {
      setSyncMessage(error.message);
    }
    setIsSyncing(false);
  };

  if (!profile) {
    return <div className="text-center text-text-secondary">Loading your adventure...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Welcome, {profile.avatarName}!</h2>
     
        <button
          onClick={handleSync}
          disabled={isSyncing || !profile.strava}
          className="px-3 py-1.5 text-sm font-semibold bg-accent rounded-lg hover:bg-red-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isSyncing ? 'Syncing...' : 'Sync Activities'}
        </button>
      </div>

      {syncMessage && <p className="text-center text-sm text-text-secondary p-2 bg-primary-bg rounded-md">{syncMessage}</p>}

      <div className="bg-primary-bg p-4 rounded-lg space-y-2">
        <p className="font-bold text-lg text-accent">Level: {profile.level}</p>
        <div>
          <label className="text-sm text-text-secondary">XP Progress</label>
          <div className="w-full bg-tertiary-bg rounded-full h-4 mt-1">
            <div className="bg-accent h-4 rounded-full" style={{ width: `${profile.xp}%` }}></div>
          </div>
          <p className="text-right text-sm text-text-secondary">{profile.xp} / 100</p>
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