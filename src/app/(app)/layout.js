'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { HomeIcon, ShieldIcon, UserIcon, SettingsIcon } from '@/components/Icons';

const BottomNav = () => {
  const pathname = usePathname();
  const navItems = [
    { href: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { href: '/quests', icon: ShieldIcon, label: 'Quests' },
    { href: '/profile', icon: UserIcon, label: 'Profile' },
    { href: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-tertiary-bg border-t border-border-color flex justify-around">
      {navItems.map(({ href, icon: Icon, label }) => (
        <Link key={href} href={href} className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${pathname === href ? 'text-accent' : 'text-text-secondary hover:text-white'}`}>
          <Icon className="h-6 w-6" />
          <span className="text-xs mt-1">{label}</span>
        </Link>
      ))}
    </nav>
  );
};


export default function AppLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="flex items-center justify-center h-screen text-accent text-xl">Loading Your Adventure...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-secondary-bg h-screen flex flex-col">
      <header className="p-4 bg-tertiary-bg text-center shadow-md">
        <h1 className="text-2xl font-bold text-accent">QuestMode Fitness</h1>
      </header>
      <main className="flex-grow p-6 pb-20 overflow-y-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
