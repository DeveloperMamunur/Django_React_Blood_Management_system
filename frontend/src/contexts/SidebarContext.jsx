import { useState, useEffect, createContext } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children, defaultOpen = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarOpen');
      return saved !== null ? JSON.parse(saved) : defaultOpen;
    }
    return defaultOpen;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
    }
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <SidebarContext.Provider value={{ 
      sidebarOpen, 
      setSidebarOpen, 
      toggleSidebar, 
      openSidebar, 
      closeSidebar 
    }}>
      {children}
    </SidebarContext.Provider>
  );
};
