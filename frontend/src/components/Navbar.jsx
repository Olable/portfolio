import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiUser, FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/projects', label: 'Projects' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0b1020]/70 border-b border-white/5">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white">
            O
          </span>
          <span className="gradient-text">olble</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          {user?.is_staff && (
            <Link to="/admin/dashboard" className="nav-link flex items-center gap-1">
              <FiUser /> Admin
            </Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="nav-link flex items-center gap-1">
              <FiLogOut /> Logout
            </button>
          ) : (
            <Link to="/login" className="ml-2 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-purple-600 text-white font-medium hover:opacity-90 transition">
              Login
            </Link>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggle} className="p-2 text-gray-300">
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          <button onClick={() => setOpen(!open)} className="p-2 text-gray-200">
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#0b1020]/95 px-4 py-3 space-y-1 animate-fade-in">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block nav-link ${isActive ? 'active' : ''}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {user?.is_staff && (
            <Link to="/admin/dashboard" onClick={() => setOpen(false)} className="block nav-link">
              Admin Dashboard
            </Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="block w-full text-left nav-link">
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="block nav-link">
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
