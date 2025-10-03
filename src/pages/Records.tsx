import React from 'react';
import { SidebarLayout } from './layout/SidebarLayout';

const Records: React.FC & {
    layout?: (page: React.ReactNode) => JSX.Element;
} = () =>
        <div className='text-white'>
            Records content
        </div>;

Records.layout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Records;