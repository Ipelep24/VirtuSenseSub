import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarMenu from './SidebarMenu';
import SidebarFooter from './SidebarFooter';
import { IoIosMenu, IoIosClose } from "react-icons/io";

type NavItem = {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
};

const Sidebar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const MenuIcon = IoIosMenu as React.ComponentType<{ className?: string; onClick?: () => void }>;
  const CloseIcon = IoIosClose as React.ComponentType<{ className?: string; onClick?: () => void }>;

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Navigation Bar */}
      <nav className='relative flex justify-between items-center h-1/8 sm:hidden p-2 px-4 bg-[#1d1d1d] text-white outline outline-[#2d2d2d]'>
        <div className='flex'>
          <img
            src="/logo.png"
            alt="Logo"
            width={100}
            height={100}
            className='w-10 h-auto'
          />
          <h1 className='text-xl font-semibold gap-2 p-2'>VirtuSense</h1>
        </div>
        <MenuIcon 
          className='w-6 h-6 cursor-pointer' 
          onClick={() => setIsMobileMenuOpen(true)}
        />
      </nav>

      {/* Mobile Sidebar Popup */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop - More opaque */}
          <div 
            className="fixed inset-0 bg-black opacity-50 z-40 sm:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar - Solid background */}
          <nav className="fixed top-0 right-0 h-full w-52 flex flex-col p-4 text-white bg-[#1d1d1d] shadow-2xl z-50 sm:hidden">
            {/* Close Button */}
            <div className="flex justify-end mb-6">
              <CloseIcon 
                className='w-8 h-8 cursor-pointer hover:text-gray-300 transition-colors' 
                onClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
            
            {/* Logo */}
            <div className='w-full mb-8'>
              <div className='flex items-center gap-3'>
                <img
                  src="/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className='w-10 h-10'
                />
                <h1 className='text-xl font-semibold'>VirtuSense</h1>
              </div>
            </div>
            
            <SidebarMenu />
            <SidebarFooter />
          </nav>
        </>
      )}

      {/* Desktop Sidebar */}
      <nav className="hidden h-full sm:flex flex-col p-2 text-white bg-[#1d1d1d] outline outline-[#2d2d2d]">
        <div className='w-full h-1/8'>
          <div className='flex items-center justify-center'>
            <img
              src="/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className='w-10 h-auto'
            />
            <h1 className='hidden md:block text-xl font-semibold gap-2 p-2'>VirtuSense</h1>
          </div>
        </div>
        <SidebarMenu />
        <SidebarFooter />
      </nav>
    </>
  );
};

export default Sidebar;