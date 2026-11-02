import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Header({ onReportClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();

  return (
    <>
      <div className="bg-maroon-900 text-cream-100 font-mono text-[11.5px] tracking-wider">
        <div className="wrap flex justify-between items-center py-[7px] opacity-85">
          <span className="whitespace-nowrap">CAMPUSCONNECT · KUMARAGURU COLLEGE OF TECHNOLOGY</span>
          <span className="whitespace-nowrap hidden sm:inline">HELP DESK · STUDENT ACTIVITY CENTRE</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-gradient-to-b from-maroon-700 to-maroon-600 text-cream-50 shadow-lg">
        <div className="wrap flex items-center justify-between gap-6 py-4">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="w-[42px] h-[42px] border-[1.5px] border-gold-300 flex items-center justify-center font-display font-bold text-[15px] text-gold-300 rounded-sm">
              FX
            </div>
            <div>
              <h1 className="font-display text-lg leading-tight text-cream-50 m-0">FindX</h1>
              <p className="m-0 mt-[1px] text-[11px] text-gold-300 font-mono tracking-wider">LOST &amp; FOUND REGISTRY</p>
            </div>
          </Link>

          <nav className={`md:flex gap-7 items-center ${menuOpen ? 'flex' : 'hidden'} md:static absolute top-[73px] left-0 right-0 md:bg-transparent bg-maroon-700 flex-col md:flex-row md:p-0 p-5 shadow-lg md:shadow-none`}>
            <NavLink to="/" end className={({isActive}) => `text-sm no-underline ${isActive ? 'opacity-100' : 'opacity-85'} hover:opacity-100`}>Browse</NavLink>
            {user && <NavLink to="/dashboard" className={({isActive}) => `text-sm no-underline ${isActive ? 'opacity-100' : 'opacity-85'} hover:opacity-100`}>Dashboard</NavLink>}
            {isAdmin && <NavLink to="/admin" className={({isActive}) => `text-sm no-underline ${isActive ? 'opacity-100' : 'opacity-85'} hover:opacity-100`}>Admin</NavLink>}
            {!user && <NavLink to="/login" className={({isActive}) => `text-sm no-underline ${isActive ? 'opacity-100' : 'opacity-85'} hover:opacity-100`}>Login</NavLink>}
            {user ? (
              <button onClick={logout} className="text-sm opacity-85 hover:opacity-100 text-left">Logout</button>
            ) : (
              <NavLink to="/register" className={({isActive}) => `text-sm no-underline ${isActive ? 'opacity-100' : 'opacity-85'} hover:opacity-100`}>Register</NavLink>
            )}
          </nav>

          {user ? (
            <button onClick={onReportClick} className="hidden md:inline-block bg-gold-500 text-maroon-900 border-none px-[18px] py-[10px] font-semibold text-[13.5px] rounded-sm whitespace-nowrap hover:bg-gold-300 active:translate-y-[1px] transition-colors">
              Report an item
            </button>
          ) : (
            <Link to="/login" className="hidden md:inline-block bg-gold-500 text-maroon-900 px-[18px] py-[10px] font-semibold text-[13.5px] rounded-sm whitespace-nowrap hover:bg-gold-300 transition-colors no-underline">
              Sign in to report
            </Link>
          )}

          <button className="md:hidden bg-none border-none text-cream-50 text-2xl" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">☰</button>
        </div>
      </header>
    </>
  );
}
