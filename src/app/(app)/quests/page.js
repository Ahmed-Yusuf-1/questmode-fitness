'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import QuestCard from '@/components/QuestCard';

export default function QuestsPage() {
  const { user } = useAuth();
  const [quests, setQuests] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "quests"));
        const questsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuests(questsData);
      } catch (error) {
        console.error("Error fetching quests:", error);
      }
    };

    fetchQuests();
  }, []);

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
        setUserProfile(doc.data());
        setLoading(false);
      });
      return () => unsub();
    }
  }, [user]);

  const handleAcceptQuest = async (questId) => {
    if (user && !userProfile.activeQuestId) {
      const userDocRef = doc(db, "users", user.uid);
      try {
        await updateDoc(userDocRef, {
          activeQuestId: questId
        });
      } catch (error) {
        console.error("Error accepting quest:", error);
      }
    }
  };

  if (loading) {
    return <div className="text-center text-text-secondary">Loading quests...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Quest Board</h2>
      <div className="space-y-4">
        {quests.map(quest => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onAccept={handleAcceptQuest}
            isActive={userProfile?.activeQuestId === quest.id}
          />
        ))}
      </div>
    </div>
  );
}
