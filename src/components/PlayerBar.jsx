import React, { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause, FaExpand, FaStepBackward, FaStepForward } from 'react-icons/fa';
import { MdVolumeUp, MdVolumeOff } from 'react-icons/md';

export default function PlayerBar({ 
  song, 
  isPlaying, 
  onPlayPause, 
  onSongEnd, 
  onFullScreen,
  onNext,
  onPrevious
}) {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  if (!song) return null;

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Auto-play prevented", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, song]);
  

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setCurrentTime(0);
      onSongEnd();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onSongEnd]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-950 text-white p-4 border-t border-gray-700 z-50">
      <div className="flex items-center justify-between">
        {/* Song Info */}
        <div className="flex items-center gap-4 w-1/4">
          <img
            src={song.coverArt}
            alt={song.title}
            className="w-14 h-14 object-cover rounded"
          />
          <div className="truncate">
            <h4 className="text-sm font-semibold truncate">{song.title}</h4>
            <p className="text-xs text-gray-400 truncate">{song.artist}</p>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex flex-col items-center w-2/4 gap-2">
          <div className="flex items-center gap-6">
            <button 
              onClick={onPrevious}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <FaStepBackward size={16} />
            </button>
            
            <button
              onClick={onPlayPause}
              className="bg-emerald-500 cursor-pointer p-3 rounded-full text-black hover:bg-emerald-400 transition-colors"
            >
              {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} className="ml-0.5" />}
            </button>
            
            <button 
              onClick={onNext}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <FaStepForward size={16} />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-gray-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleTimeChange}
              style={{
                '--value': currentTime,
                '--max': duration || 1,
                background: `linear-gradient(to right, #10b981 ${(currentTime / (duration || 1)) * 100}%, #374151 ${(currentTime / (duration || 1)) * 100}%)`
              }}
              className="w-full h-1 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume and Fullscreen Controls */}
        <div className="flex items-center justify-end gap-4 w-1/4">
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-gray-400 hover:text-white">
              {isMuted ? <MdVolumeOff size={20} /> : <MdVolumeUp size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              style={{
                background: `linear-gradient(to right, #10b981 ${volume * 100}%, #374151 ${volume * 100}%)`
              }}
              className="w-24 h-1 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <button
            onClick={onFullScreen}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <FaExpand size={16} />
          </button>
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={song.audioSrc}
        preload="metadata"
      />
    </div>
  );
}
