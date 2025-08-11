import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PlayerBar from "../components/PlayerBar";
import { songs as initialSongs } from "../constant/constants";

export default function Layout1() {
  const [filteredSongs, setFilteredSongs] = useState(initialSongs);

  return (
    <div className="flex flex-col min-h-full bg-zinc-950 text-white">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-col flex-1">
          {/* Header visible everywhere */}
          <Header songs={initialSongs} onSearch={setFilteredSongs} />

          <div className="flex-1">
            {/* Pass filtered songs to pages via Outlet context */}
            <Outlet context={{ filteredSongs }} />
          </div>
        </div>
      </div>
      <PlayerBar />
    </div>
  );
}
