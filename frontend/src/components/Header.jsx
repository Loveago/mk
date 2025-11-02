import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Bars3Icon,
  ShoppingCartIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import SearchBar from './SearchBar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop' },
  { to: '/flash-sale', label: 'Flash Sale', disabled: true },
];

export default function Header({ onSearch }) {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const userLinks = [
    { to: '/account', label: 'Account' },
    { to: '/orders', label: 'Orders', disabled: true },
    hasRole('VENDOR') && { to: '/vendor', label: 'Vendor Dashboard' },
    hasRole('ADMIN') && { to: '/admin', label: 'Admin Panel' },
  ].filter(Boolean);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="bg-[#F68B1E] text-white text-xs py-2 text-center">
        Free delivery on orders over GH₵150 across Accra & Tema
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-6 py-4">
          <button
            className="md:hidden p-2 rounded-md border border-gray-200"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
          <Link to="/" className="text-2xl font-bold text-[#F68B1E] whitespace-nowrap">
            MK Marketplace
          </Link>
          <div className="hidden md:flex flex-1">
            <SearchBar onSearch={onSearch} />
          </div>
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-600">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `hover:text-[#F68B1E] transition ${link.disabled ? 'pointer-events-none opacity-50' : ''} ${
                    isActive ? 'text-[#F68B1E]' : ''
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative">
              <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 text-[10px] bg-[#F68B1E] text-white rounded-full px-1.5 py-0.5">
                  {count}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="relative">
                <details className="group">
                  <summary className="list-none flex items-center gap-2 cursor-pointer select-none">
                    <UserCircleIcon className="h-7 w-7 text-gray-700" />
                    <span className="hidden sm:block text-sm font-semibold text-gray-700">
                      Hi, {user?.name}
                    </span>
                  </summary>
                  <div className="absolute right-0 mt-3 w-52 rounded-xl border border-gray-100 bg-white shadow-lg">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-xs uppercase text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{user?.email}</p>
                      <span className="mt-1 inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-[#F68B1E] uppercase">
                        {user?.role}
                      </span>
                    </div>
                    <nav className="flex flex-col">
                      {userLinks.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className={`px-4 py-2.5 text-sm hover:bg-orange-50 ${
                            item.disabled ? 'opacity-40 cursor-not-allowed' : ''
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </nav>
                  </div>
                </details>
              </div>
            ) : (
              <div className="hidden md:flex gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-[#F68B1E]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-[#F68B1E] text-white px-4 py-2 rounded-full hover:bg-[#e57910] transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="md:hidden pb-4">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-inner">
          <nav className="flex flex-col px-4 py-3 gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `py-2 text-sm font-medium ${
                    isActive ? 'text-[#F68B1E]' : 'text-gray-700'
                  } ${link.disabled ? 'opacity-50 pointer-events-none' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="px-4 pb-4">
            {isAuthenticated ? (
              <div className="space-y-2">
                {userLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`block text-sm font-medium text-gray-700 ${
                      item.disabled ? 'opacity-40 pointer-events-none' : 'hover:text-[#F68B1E]'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-sm font-semibold text-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-semibold text-gray-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center w-full text-sm font-semibold bg-[#F68B1E] text-white px-4 py-2 rounded-full"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


