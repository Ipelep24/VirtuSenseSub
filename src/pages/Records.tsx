import React from 'react';
import { SidebarLayout } from './layout/SidebarLayout';

const Records: React.FC & {
    layout?: (page: React.ReactNode) => JSX.Element;
} = () => {
    return (
        <div className='text-white p-4'>
            Records Content
        </div>
    )
}


Records.layout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Records;