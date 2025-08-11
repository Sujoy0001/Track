import React, { useContext, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FaPlay, FaHeart, FaPause } from "react-icons/fa";
import PlayerBar from "../components/PlayerBar";
import FullPlayBar from "../components/FullPlayBar";
import { FavoritesContext } from "../context/FavoritesContext";

export default function Home() {
  const { favoriteIds, toggleFavorite } = useContext(FavoritesContext);
  const { filteredSongs } = useOutletContext(); // Get songs from Layout
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const songs = filteredSongs.map((song) => ({
    ...song,
    isFavorite: favoriteIds.includes(song.id),
  }));

  const addToRecent = (song) => {
    const stored = JSON.parse(localStorage.getItem("recentSongs")) || [];
    let updated = [song, ...stored.filter((s) => s.id !== song.id)];
    if (updated.length > 20) updated = updated.slice(0, 20);
    localStorage.setItem("recentSongs", JSON.stringify(updated));
  };

  const playSong = (song) => {
    addToRecent(song);
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-zinc-950 text-gray-100 p-4 flex-1 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">All Songs</h2>

      <div className="grid grid-cols-3 gap-4">
        {songs.length > 0 ? (
          songs.map((song) => (
            <div
              key={song.id}
              className="relative flex items-center gap-4 px-3 py-2 bg-zinc-800/50 rounded-md hover:bg-zinc-800 transition group cursor-pointer"
            >
              <img
                src={song.coverArt}
                alt={song.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-white font-medium truncate">{song.title}</h3>
                <p className="text-gray-400 text-sm truncate">{song.artist}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(song.id);
                }}
                className={`text-lg z-10 cursor-pointer ${
                  song.isFavorite ? "text-emerald-500" : "text-gray-400"
                }`}
              >
                <FaHeart />
              </button>
              <button
                onClick={() => playSong(song)}
                className="absolute inset-0 flex items-center justify-center bg-green-700/10 bg-opacity-40 opacity-0 group-hover:opacity-100 transition cursor-pointer"
              >
                {currentSong?.id === song.id && isPlaying ? (
                  <FaPause size={20} />
                ) : (
                  <FaPlay size={20} />
                )}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No songs found.</p>
        )}
      </div>

      {currentSong && !isFullScreen && (
        <PlayerBar
          song={currentSong}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onSongEnd={() => setIsPlaying(false)}
          onFullScreen={() => setIsFullScreen(true)}
        />
      )}

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
