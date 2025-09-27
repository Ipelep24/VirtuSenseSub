// pages/Dashboard.tsx
import React from 'react';
import { SidebarLayout } from './layout/SidebarLayout';

const Dashboard: React.FC & {
    layout?: (page: React.ReactNode) => JSX.Element;
} = () =>
        <div>
            Dashboard content
        </div>;

Dashboard.layout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Dashboard;