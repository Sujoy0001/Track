import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlay, FaPause, FaTrash, FaUpload } from 'react-icons/fa';
import PlayerBar from '../components/PlayerBar';
import FullPlayBar from '../components/FullPlayBar';
import localforage from 'localforage';
import img404 from "../assets/artist/disc-spinning.gif";

const defaultCover = img404;

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function Upload() {
  const [songs, setSongs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [coverArt, setCoverArt] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const loadedSongs = JSON.parse(localStorage.getItem("uploadedSongs")) || [];
    setSongs(loadedSongs);
  }, []);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverArt(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) setAudioFile(file);
  };

  const handleUpload = async () => {
    if (!title || !artist || !audioFile) {
      alert('Please fill in all fields and upload the audio file.');
      return;
    }
    setIsUploading(true);

    const coverBase64 = coverArt ? await fileToBase64(coverArt) : defaultCover;
    const songId = Date.now().toString();

    await localforage.setItem(songId, audioFile);

    const newSong = {
      id: songId,
      title,
      artist,
      coverArt: coverBase64,
      audioKey: songId,
      uploadDate: new Date().toLocaleDateString(),
    };

    const updatedSongs = [newSong, ...songs];
    localStorage.setItem("uploadedSongs", JSON.stringify(updatedSongs));
    setSongs(updatedSongs);

    setTitle('');
    setArtist('');
    setCoverArt(null);
    setAudioFile(null);
    setCoverPreview(null);
    setShowModal(false);
    setIsUploading(false);
  };

  const playSong = async (song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      const file = await localforage.getItem(song.audioKey);
      const audioUrl = URL.createObjectURL(file);
      setCurrentSong({ ...song, audioSrc: audioUrl });
      setIsPlaying(true);
    }
  };

  const removeSong = async (id) => {
    const updatedSongs = songs.filter((song) => song.id !== id);
    localStorage.setItem("uploadedSongs", JSON.stringify(updatedSongs));
    setSongs(updatedSongs);
    await localforage.removeItem(id);

    if (currentSong?.id === id) {
      setCurrentSong(null);
      setIsPlaying(false);
    }
  };

  return (
    <div className="p-6 text-white relative bg-zinc-950 flex-1 overflow-y-auto">
      {/* Header */}
      <h2 className="text-3xl font-bold mb-8">Uploaded Songs</h2>

      {/* Floating Upload Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 p-4 rounded-full shadow-lg transition-transform hover:scale-105 z-50 cursor-pointer"
      >
        <FaUpload size={20} />
      </button>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-zinc-950/70 bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-xl max-w-md w-full p-6 relative shadow-lg">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FaTimes size={20} />
            </button>

            <h3 className="text-xl font-bold mb-4">Upload New Song</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Song Title"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              />
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Artist Name"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              />
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col items-center border-2 border-dashed border-gray-600 rounded-lg p-4 cursor-pointer hover:border-emerald-500 transition">
                  <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                  {coverPreview ? (
                    <img src={coverPreview} alt="Preview" className="h-24 w-24 object-cover rounded" />
                  ) : "Select Image"}
                </label>
                <label className="flex flex-col items-center border-2 border-dashed border-gray-600 rounded-lg p-4 cursor-pointer hover:border-emerald-500 transition">
                  <input type="file" accept="audio/*" onChange={handleAudioChange} className="hidden" />
                  {audioFile ? audioFile.name : "Select Audio"}
                </label>
              </div>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className={`w-full py-2 rounded-lg font-medium cursor-pointer ${
                  isUploading ? 'bg-gray-600' : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                {isUploading ? 'Uploading...' : 'Upload Song'}
              </button>
            </div>
          </div>
        </div>
      )}

    {songs.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
            {songs.map((song) => (
            <div
                key={song.id}
                className="bg-zinc-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:scale-[1.05] transition transform flex-shrink-0"
            >
                <div className="relative group">
                <img
                    src={song.coverArt || defaultCover}
                    alt={song.title}
                    className="w-full h-48 object-cover"
                />
                <button
                    onClick={() => removeSong(song.id)}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                    <FaTrash size={14} />
                </button>
                <button
                    onClick={() => playSong(song)}
                    className="absolute bottom-3 right-3 bg-emerald-500 hover:bg-emerald-600 p-3 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                    {currentSong?.id === song.id && isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                </div>
                <div className="p-4">
                <h3 className="font-semibold truncate">{song.title}</h3>
                <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                <p className="text-xs text-gray-500 mt-1">Uploaded: {song.uploadDate}</p>
                </div>
            </div>
            ))}
        </div>
    ) : (
         <p className="text-gray-400">No songs uploaded yet.</p>
    )}


      {/* Player Bars */}
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
