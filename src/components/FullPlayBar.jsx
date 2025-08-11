import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaTimes, FaStepBackward, FaStepForward } from 'react-icons/fa';
import { MdVolumeUp, MdVolumeOff } from 'react-icons/md';

export default function FullPlayBar({ 
  song, 
  isPlaying, 
  onPlayPause, 
  onClose,
  onNext,
  onPrevious
}) {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const progressRef = useRef(null);

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
    const updateDuration = () => setDuration(audio.duration || 0);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('canplay', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('canplay', updateDuration);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
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
    <div className="fixed inset-0 bg-zinc-900 text-white z-50 animate-slide-up flex flex-col">
      {/* Close Button */}
      <div className="flex justify-end p-6">
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white text-2xl transition-opacity hover:opacity-80 cursor-pointer"
        >
          <FaTimes />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow px-6">
        {/* Song Art */}
        <div className="mb-8 w-64 h-64 md:w-80 md:h-80 lg:w-72 lg:h-72">
          <img
            src={song.coverArt}
            alt={song.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Song Info */}
        <div className="text-center mb-8 max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold mb-1">{song.title}</h2>
          <p className="text-gray-400 text-lg">{song.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-lg mb-4">
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="text-sm text-gray-400">{formatTime(currentTime)}</span>
            <span className="text-sm text-gray-400">{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleTimeChange}
            className="w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer"
            style={{
              backgroundImage: `linear-gradient(to right, #10b981 ${(currentTime / (duration || 100)) * 100}%, #374151 ${(currentTime / (duration || 100)) * 100}%)`
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 md:gap-8 mt-4">
          <button 
            onClick={onPrevious}
            className="text-gray-300 hover:text-white text-xl transition-colors cursor-pointer"
          >
            <FaStepBackward />
          </button>

          <button
            onClick={onPlayPause}
            className="bg-emerald-500 p-5 rounded-full text-black hover:bg-emerald-400 text-2xl transition-transform hover:scale-105 cursor-pointer"
          >
            {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
          </button>

          <button 
            onClick={onNext}
            className="text-gray-300 hover:text-white text-xl transition-colors cursor-pointer"
          >
            <FaStepForward />
          </button>
        </div>
      </div>

      {/* Volume Controls */}
      <div className="p-6 flex items-center justify-center gap-3">
        <button onClick={toggleMute} className="text-gray-300 hover:text-white cursor-pointer">
          {isMuted ? <MdVolumeOff size={24} /> : <MdVolumeUp size={24} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-32 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer"
          style={{
            backgroundImage: `linear-gradient(to right, #10b981 ${(isMuted ? 0 : volume) * 100}%, #374151 ${(isMuted ? 0 : volume) * 100}%)`
          }}
        />
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={song.audioSrc}
        autoPlay={isPlaying}
        onEnded={onNext}
      />
    </div>
  );
}