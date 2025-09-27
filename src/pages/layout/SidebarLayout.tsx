// layouts/SidebarLayout.tsx
import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';

type Props = {
  children: React.ReactNode;
};

export const SidebarLayout: React.FC<Props> = ({ children }) => (
  <div className='flex h-screen w-screen'>
    <Sidebar/>
    <main>{children}</main>
  </div>
);