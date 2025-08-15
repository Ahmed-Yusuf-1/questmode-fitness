'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LogOutIcon } from '@/components/Icons';

export default function SettingsPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <p className="text-text-secondary mb-6">Manage your account and connections.</p>
      <button 
        onClick={handleSignOut} 
        className="flex items-center gap-2 px-4 py-2 font-semibold text-text-primary bg-danger rounded-lg hover:bg-red-700 transition-colors"
      >
        <LogOutIcon className="h-5 w-5" />
        Sign Out
      </button>
    </div>
  );
}