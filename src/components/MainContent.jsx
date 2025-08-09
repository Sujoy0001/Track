import React from 'react';

const playlists = [
  { id: 1, name: "Top Hits", description: "Most played songs", color: "from-pink-500 to-red-500" },
  { id: 2, name: "Workout", description: "Energy boosters", color: "from-yellow-500 to-orange-500" },
  { id: 3, name: "Chill Vibes", description: "Relax and unwind", color: "from-green-400 to-teal-500" },
];

export default function MainContent() {
  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <h3 className="text-2xl font-bold mb-4">Featured Playlists</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {playlists.map((list) => (
          <div
            key={list.id}
            className={`p-4 rounded-lg bg-gradient-to-br ${list.color} shadow hover:scale-105 transform transition`}
          >
            <h4 className="text-xl font-bold">{list.name}</h4>
            <p className="text-sm text-white/80">{list.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
