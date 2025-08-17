'use client';

import { ShieldIcon } from './Icons';

export default function QuestCard({ quest, onAccept, isActive, isCompleted }) {
  return (
    <div className={`bg-primary-bg p-4 rounded-lg border border-border-color shadow-md transition-all ${isActive ? 'border-accent' : ''}`}>
      <h3 className="text-lg font-bold text-accent">{quest.title}</h3>
      <p className="text-sm text-text-secondary mt-1 mb-3">{quest.description}</p>
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <ShieldIcon className="h-5 w-5 text-accent" />
          <span className="font-semibold">{quest.xp} XP</span>
        </div>
        <span className="font-semibold text-text-secondary">
          Goal: {quest.type === 'Walk' ? `${quest.goal / 1000}km` : `${quest.goal / 60}min`}
        </span>
      </div>
      {onAccept && (
        <button
          onClick={() => onAccept(quest.id)}
          className="w-full mt-4 px-4 py-2 font-semibold text-text-primary bg-accent rounded-lg hover:bg-red-500 transition-colors disabled:bg-gray-500"
          disabled={isActive}
        >
          {isActive ? 'Active Quest' : 'Accept Quest'}
        </button>
      )}
    </div>
  );
}
