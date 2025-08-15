'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || user) {
    return <div className="flex items-center justify-center h-screen text-accent text-xl">Loading Your Adventure...</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-secondary-bg rounded-xl shadow-lg text-center">
        <h2 className="text-3xl font-bold text-accent">
          {isLoginView ? 'Welcome Back!' : 'Create Your Hero'}
        </h2>
        <form onSubmit={handleAuthAction} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 text-text-primary bg-primary-bg border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 text-text-primary bg-primary-bg border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button type="submit" className="w-full px-4 py-2 font-semibold text-text-primary bg-accent rounded-lg hover:bg-red-500 transition-colors">
            {isLoginView ? 'Log In' : 'Sign Up'}
          </button>
          {error && <p className="text-sm text-danger">{error}</p>}
        </form>
        <button onClick={() => setIsLoginView(!isLoginView)} className="text-sm text-text-secondary hover:text-accent">
          {isLoginView ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
        </button>
      </div>
    </div>
  );
}
