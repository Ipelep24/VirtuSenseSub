import React from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { GoHome } from 'react-icons/go';
import { LuList } from 'react-icons/lu';

type NavItem = {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
};

const SidebarMenu: React.FC = () => {
    const location = useLocation();
    const history = useHistory();

    const navItems: NavItem[] = [
        { label: 'Home', path: '/', icon: GoHome as React.ComponentType<{ className?: string }> },
        { label: 'Records', path: '/records', icon: LuList as React.ComponentType<{ className?: string }> },
    ];


    return (
        <div className='w-full h-6/8 py-2'>
            <ul className="space-y-2">
                {navItems.map(({ label, path, icon: Icon }) => {
                    const isActive = location.pathname === path
                    return (
                        <li key={label}>
                            <button
                                onClick={() => history.push(path)}
                                className={`w-full flex items-center sm:justify-center lg:justify-start gap-3 sm:gap-0 lg:gap-3 px-3 py-2 rounder-md transition-colors cursor-pointer ${isActive
                                        ? 'text-[#2dc8b5] font-semibold'
                                        : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className='block sm:hidden lg:block'>{label}</span>
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default SidebarMenu