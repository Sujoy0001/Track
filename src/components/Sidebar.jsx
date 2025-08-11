import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HiHome, 
  HiHeart,
  HiClock,
  HiUpload,
  HiMusicNote
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gradient-to-b from-black to-zinc-900 p-4 hidden md:block h-screen sticky top-0 border-r-2 border-gray-800/30">
      <div className="space-y-8">
        {/* Logo */}
        
        <div className="flex items-center space-x-2 py-2 px-2">
          <Link to="/" className='flex gap-2'>
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-xl">♪</span>
          </div>
          <h1 className="text-2xl font-bold text-emerald-400">Track</h1></Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          <NavItem to="/" icon={<HiHome size={24} />} text="Home" />
          <NavItem to="/playlist" icon={<HiMusicNote size={24} />} text="Playlist" />
          <NavItem to="/fav" icon={<HiHeart size={24} />} text="Favorites" />
          <NavItem to="/recent" icon={<HiClock size={24} />} text="Recently Played" />
          <NavItem to="/upload" icon={<HiUpload size={24} />} text="Upload Music" />
        </nav>
      </div>
    </aside>
  );
}

function NavItem({ to, icon, text }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-4 p-2 rounded-md transition-colors ${
          isActive
            ? 'bg-zinc-800 text-white'
            : 'text-gray-400 hover:text-white hover:bg-zinc-800'
        }`
      }
    >
      <span className={({ isActive }) => (isActive ? 'text-emerald-400' : 'text-gray-400')}>
        {icon}
      </span>
      <span className="font-medium">{text}</span>
    </NavLink>
  );
}
