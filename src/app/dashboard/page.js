'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore'; // Import onSnapshot for real-time data
import { auth, db } from '@/lib/firebase';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null); // State to hold user profile data

  // --- Redirect if not logged in ---
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // --- Fetch user profile data from Firestore ---
  useEffect(() => {
    if (user) {
      // Set up a real-time listener for the user's document
      const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
        if (doc.exists()) {
          setProfile(doc.data());
        } else {
          console.log("No such document!");
        }
      });
      // Clean up the listener when the component unmounts
      return () => unsub();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading || !profile) {
    return <div className="flex items-center justify-center h-screen text-accent text-xl">Loading Your Adventure...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-secondary-bg h-screen flex flex-col">
      <header className="p-4 bg-tertiary-bg text-center">
        <h1 className="text-2xl font-bold text-accent">QuestMode Fitness</h1>
      </header>
      <main className="flex-grow p-6">
        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
        
        {/* --- Display Profile Data --- */}
        <div className="bg-primary-bg p-4 rounded-lg">
          <h3 className="text-lg font-bold text-accent">{profile.avatarName}</h3>
          <p>Level: {profile.level}</p>
          <p>XP: {profile.xp}</p>
        </div>
        
        <button onClick={handleSignOut} className="mt-8 px-4 py-2 font-semibold text-text-primary bg-danger rounded-lg hover:bg-red-700 transition-colors">
          Sign Out
        </button>
      </main>
      {/* We will add the main navigation bar here later */}
    </div>
  );
}
