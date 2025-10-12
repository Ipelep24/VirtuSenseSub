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
      <nav className='relative flex justify-between items-center h-1/8 sm:hidden p-2 px-4 bg-[#1d1d1d] text-white border border-[#2d2d2d]'>
        <div className='flex'>
          {/* <img
            src="/logo.png"
            alt="Logo"
            width={100}
            height={100}
            className='w-10 h-auto'
          /> */}
          <h1 className='text-xl font-semibold gap-2 p-2'>VirtuSense</h1>
        </div>
        <MenuIcon
          className='w-6 h-6 cursor-pointer'
          onClick={() => setIsMobileMenuOpen(true)}
        />
      </nav>

      {/* Mobile Sidebar Popup */}
      < div className="fixed inset-0 z-50 sm:hidden pointer-events-none">
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0'
            }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar */}
        <nav
          className={`absolute top-0 right-0 h-full w-52 flex flex-col p-4 text-white bg-[#1d1d1d] shadow-2xl transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full'
            }`}
        >
          {/* Close Button */}
          <div className="flex justify-end mb-6">
            <CloseIcon
              className="w-8 h-8 cursor-pointer hover:text-gray-300 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>

          {/* Logo */}
          <div className="w-full mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">VirtuSense</h1>
            </div>
          </div>

          <SidebarMenu />
          <SidebarFooter />
        </nav>
      </div >

      {/* Desktop Sidebar */}
      <nav className="hidden h-full sm:flex flex-col p-2 text-white bg-[#1d1d1d] border border-[#2d2d2d]">
        <div className='w-full h-1/8'>
          <div className='flex items-center justify-center'>
            {/* <img
              src="/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className='w-10 h-auto'
            /> */}
            <h1 className='hidden lg:block text-xl font-semibold gap-2 p-2'>VirtuSense</h1>
          </div>
        </div>
        <SidebarMenu />
        <SidebarFooter />
      </nav>
    </>
  );
};

export default Sidebar;