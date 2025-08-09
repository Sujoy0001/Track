import React, { useState } from "react";
import { HiSearch, HiUserCircle } from "react-icons/hi";

export default function Header({ songs, onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Filter songs by title or artist
    const filtered = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(value.toLowerCase()) ||
        song.artist.toLowerCase().includes(value.toLowerCase())
    );

    onSearch(filtered);
  };

  return (
    <header className="bg-black p-4 flex justify-between items-center sticky top-0 z-10 shadow-md border-b-2 border-gray-700/30">
      {/* Left side - Welcome message */}
      <h2 className="text-xl font-semibold text-white"></h2>

      {/* Right side - Search and User */}
      <div className="flex items-center gap-4">
        {/* Search bar */}
        <div className="relative hidden md:block">
          <HiSearch className="absolute inset-y-0 left-3 my-auto text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            className="bg-zinc-900 text-white rounded-lg py-2 pl-10 pr-4 w-72 
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 
                       placeholder-gray-400 transition"
            placeholder="Search by song or artist..."
          />
        </div>
      </div>
    </header>
  );
}
