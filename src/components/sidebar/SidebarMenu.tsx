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
                                className={`w-full flex items-center sm:justify-center md:justify-start gap-3 sm:gap-0 md:gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                                        ? 'bg-[#2d2d2d] outline-1 outline-white font-semibold'
                                        : 'text-gray-400 hover:bg-[#2d2d2d]'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className='block sm:hidden md:block'>{label}</span>
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default SidebarMenu