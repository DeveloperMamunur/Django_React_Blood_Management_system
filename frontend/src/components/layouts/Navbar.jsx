import React, { useState, useEffect } from 'react';
import { Heart, Sun, Moon, Menu, X } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';


export default function Home() {
    const { currentUser } = useAuth();
    const { darkMode, toggleDarkMode } = useDarkMode();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
        setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? ('dark:bg-gray-900/95 dark:backdrop-blur-lg dark:shadow-lg bg-white/95 backdrop-blur-lg shadow-lg') : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              <span className="text-xl font-bold">LifeFlow</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
              <a href="#about" className="hover:text-red-500 transition-colors">About</a>
              <a href="#donate" className="hover:text-red-500 transition-colors">Donate</a>
              <a href="#inventory" className="hover:text-red-500 transition-colors">Inventory</a>
              <a href="#contact" className="hover:text-red-500 transition-colors">Contact</a>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors dark:bg-gray-800 dark:hover:bg-gray-700 bg-gray-200 hover:bg-gray-300'}`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {!currentUser ? (
                <Link to="/login" className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105">
                  Sign In
                </Link> 
              ) : (
                <Link to="/dashboard" className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105">
                  Dashboard
                </Link>
              )}
            </div>

            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg dark:bg-gray-800 bg-gray-200'}`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden dark:bg-gray-900 bg-white border-t dark:border-gray-800 border-gray-200}`}>
            <div className="px-4 py-4 space-y-3">
              <Link to="/" className="block hover:text-red-500 transition-colors">Home</Link>
              <a href="#about" className="block hover:text-red-500 transition-colors">About</a>
              <a href="#donate" className="block hover:text-red-500 transition-colors">Donate</a>
              <a href="#inventory" className="block hover:text-red-500 transition-colors">Inventory</a>
              <a href="#contact" className="block hover:text-red-500 transition-colors">Contact</a>
              {!currentUser ? (
                <Link to="/login" className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105">
                  Sign In
                </Link> 
              ) : (
                <Link to="/dashboard" className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105">
                  Dashboard
                </Link>
              )}
              
            </div>
          </div>
        )}
      </nav>
    )
}