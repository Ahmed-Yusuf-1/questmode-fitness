'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-accent text-xl">Loading Your Adventure...</div>;
  }

  if (!user) {
    return null; // or a redirect component
  }

  return (
    <div className="max-w-md mx-auto bg-secondary-bg h-screen flex flex-col">
      <header className="p-4 bg-tertiary-bg text-center">
        <h1 className="text-2xl font-bold text-accent">QuestMode Fitness</h1>
      </header>
      <main className="flex-grow p-6">
        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
        <p>Welcome, adventurer! Your user ID is:</p>
        <p className="text-sm text-text-secondary break-all">{user.uid}</p>
        
        <button onClick={handleSignOut} className="mt-8 px-4 py-2 font-semibold text-text-primary bg-danger rounded-lg hover:bg-red-700 transition-colors">
          Sign Out
        </button>
      </main>
      {/* We will add the main navigation bar here later */}
    </div>
  );
}
