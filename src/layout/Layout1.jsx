import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PlayerBar from '../components/PlayerBar';

export default function Layout1() {
  return (
    <div className="flex flex-col min-h-full bg-zinc-950 text-white">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <div className="flex-1">
            <Outlet className="min-h-full" />
          </div>
        </div>
      </div>
      <PlayerBar />
    </div>
  );
}
