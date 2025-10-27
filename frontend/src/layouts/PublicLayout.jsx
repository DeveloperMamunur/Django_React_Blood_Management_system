import React from 'react';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
    return (
    <div className={`min-h-screen transition-colors duration-300 dark:bg-gray-900 dark:text-white bg-gray-50 text-gray-900}`}>
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Your content goes here */}
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}