import React, { useState, useMemo } from 'react';
import { songs } from '../constant/constants';
import PlayerBar from '../components/PlayerBar';
import FullPlayBar from '../components/FullPlayBar';
import { FaPlay, FaPause } from 'react-icons/fa';

export default function Playlist() {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Group songs by playlist
  const playlists = useMemo(() => {
    const groups = {};
    songs.forEach(song => {
      if (!groups[song.playlist]) {
        groups[song.playlist] = {
          coverArt: song.coverArt,
          songs: []
        };
      }
      groups[song.playlist].songs.push(song);
    });
    return groups;
  }, []);

  const playSong = (song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-zinc-950 text-gray-100 p-4 overflow-y-auto flex-1">
      {Object.entries(playlists).map(([playlistName, data], idx) => (
        <div key={idx} className="mb-10">
          {/* Playlist Title */}
          <h2 className="text-xl font-bold mb-6">{playlistName}</h2>

          {/* 6-column grid */}
          <div className="grid grid-cols-6 gap-6">
            {data.songs.map((song) => (
              <div
                key={song.id}
                className="cursor-pointer"
                onClick={() => playSong(song)}
              >
                <div className="relative group">
                  <img
                    src={song.coverArt}
                    alt={song.title}
                    className="w-full h-40 object-cover rounded-lg shadow-md"
                  />
                  <button
                    className="absolute bottom-2 right-2 bg-emerald-500 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSong(song);
                    }}
                  >
                    {currentSong?.id === song.id && isPlaying ? (
                      <FaPause />
                    ) : (
                      <FaPlay />
                    )}
                  </button>
                </div>
                <h3 className="mt-2 text-sm font-semibold truncate">{song.title}</h3>
                <p className="text-xs text-gray-400 truncate">{song.artist}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Player Bar (small) */}
      {currentSong && !isFullScreen && (
        <PlayerBar
          song={currentSong}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onSongEnd={() => setIsPlaying(false)}
          onFullScreen={() => setIsFullScreen(true)}
          onNext={() => {
            const playlistSongs = playlists[currentSong.playlist].songs;
            const idx = playlistSongs.findIndex(s => s.id === currentSong.id);
            const nextSong = playlistSongs[(idx + 1) % playlistSongs.length];
            setCurrentSong(nextSong);
          }}
          onPrevious={() => {
            const playlistSongs = playlists[currentSong.playlist].songs;
            const idx = playlistSongs.findIndex(s => s.id === currentSong.id);
            const prevSong = playlistSongs[(idx - 1 + playlistSongs.length) % playlistSongs.length];
            setCurrentSong(prevSong);
          }}
        />
      )}

      {/* Full Screen Player */}
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
