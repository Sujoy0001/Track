import React, { useContext, useState } from "react";
import { FaPlay, FaPause, FaTrash } from "react-icons/fa";
import { songs as initialSongs } from "../constant/constants";
import PlayerBar from "../components/PlayerBar";
import FullPlayBar from "../components/FullPlayBar";
import { FavoritesContext } from "../context/FavoritesContext";

export default function Favorites() {
  const { favoriteIds, removeFavorite } = useContext(FavoritesContext);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const favorites = initialSongs.filter((song) =>
    favoriteIds.includes(song.id)
  );

  const playSong = (song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-zinc-950 text-gray-100 p-4 flex-1 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">Your Favorites</h2>

      {favorites.length === 0 ? (
        <p className="text-gray-400 text-center">No favorite songs yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {favorites.map((song) => (
            <div
              key={song.id}
              onClick={() => playSong(song)}
              className="relative flex items-center gap-4 px-3 py-2 bg-zinc-800/50 rounded-md hover:bg-zinc-800 transition group cursor-pointer"
            >
              {/* Cover */}
              <img
                src={song.coverArt}
                alt={song.title}
                className="w-16 h-16 object-cover rounded"
              />

              {/* Song Info */}
              <div className="flex-1">
                <h3 className="text-white font-medium truncate">{song.title}</h3>
                <p className="text-gray-400 text-sm truncate">{song.artist}</p>
              </div>

              {/* Remove from favorites */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(song.id);
                }}
                className="text-red-500 text-lg z-10 cursor-pointer"
              >
                <FaTrash />
              </button>

              {/* Overlay Play/Pause */}
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
