import React, { useEffect, useState } from "react";
import PlayerBar from "../components/PlayerBar";
import FullPlayBar from "../components/FullPlayBar";
import { FaPlay, FaPause } from "react-icons/fa";

export default function Recent() {
  const [recentSongs, setRecentSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Load recent songs from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentSongs")) || [];
    setRecentSongs(stored);
  }, []);

  const playSong = (song) => {
    let updatedRecent = [song, ...recentSongs.filter((s) => s.id !== song.id)];
    if (updatedRecent.length > 20) updatedRecent = updatedRecent.slice(0, 20);

    setRecentSongs(updatedRecent);
    localStorage.setItem("recentSongs", JSON.stringify(updatedRecent));

    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-zinc-950 text-gray-100 p-4 flex-1 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">Recently Played</h2>

      {recentSongs.length === 0 ? (
        <p className="text-gray-400 text-center">No songs played yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {recentSongs.map((song) => (
            <div
              key={song.id}
              onClick={() => playSong(song)}
              className="relative flex items-center gap-4 px-3 py-2 bg-zinc-800/50 rounded-md hover:bg-zinc-800 transition group cursor-pointer"
            >
              {/* Cover */}
              <div className="relative">
                <img
                  src={song.coverArt}
                  alt={song.title}
                  className="w-16 h-16 object-cover rounded"
                />
                {/* Badge */}
              </div>

              <span className="absolute -top-0 -right-0 m-2 bg-emerald-500 text-xs px-2 py-0.5 rounded-full text-white shadow-md">
                Recent
              </span>

              {/* Song Info */}
              <div className="flex-1">
                <h3 className="text-white font-medium truncate">{song.title}</h3>
                <p className="text-gray-400 text-sm truncate">{song.artist}</p>
              </div>

              {/* Play/Pause Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-green-700/10 bg-opacity-30 opacity-0 group-hover:opacity-100 transition">
                {currentSong?.id === song.id && isPlaying ? (
                  <FaPause size={22} />
                ) : (
                  <FaPlay size={22} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mini Player */}
      {currentSong && !isFullScreen && (
        <PlayerBar
          song={currentSong}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onSongEnd={() => setIsPlaying(false)}
          onFullScreen={() => setIsFullScreen(true)}
        />
      )}

      {/* Fullscreen Player */}
      {isFullScreen && (
        <FullPlayBar
          song={currentSong}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onClose={() => setIsFullScreen(false)}
        />
      )}
    </div>
  );
}
