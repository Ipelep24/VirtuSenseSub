// layouts/SidebarLayout.tsx
import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';

type Props = {
  children: React.ReactNode;
};

export const SidebarLayout: React.FC<Props> = ({ children }) => (
  <div className='flex flex-col sm:flex-row h-screen w-screen'>
    <Sidebar/>
    <main className='h-full w-full flex overflow-scroll'>{children}</main>
  </div>
);