import React, { useState } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { GoHome } from 'react-icons/go';
import { LuList } from 'react-icons/lu';
import { MdReportGmailerrorred, MdOutlinePolicy } from "react-icons/md";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import PrivacyPolicyModal from '../modals/PrivacyPolicyModalProps';
import TermsOfServiceModal from '../modals/TermsOfServiceModalProps';

type NavItem = {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
};

type ActionItem = {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
};

const SidebarMenu: React.FC = () => {
    const location = useLocation();
    const history = useHistory();
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    const navItems: NavItem[] = [
        { label: 'Home', path: '/', icon: GoHome as React.ComponentType<{ className?: string }> },
        { label: 'Records', path: '/records', icon: LuList as React.ComponentType<{ className?: string }> },
    ];

    const actionItems: ActionItem[] = [
        {
            label: 'Report Problem',
            icon: MdReportGmailerrorred as React.ComponentType<{ className?: string }>,
            onClick: () => history.push('/submit-ticket')
        },
        {
            label: 'Terms of Service',
            icon: HiOutlineDocumentCheck as React.ComponentType<{ className?: string }>,
            onClick: () => setShowTerms(true)
        },
        {
            label: 'Privacy Policy',
            icon: MdOutlinePolicy as React.ComponentType<{ className?: string }>,
            onClick: () => setShowPrivacy(true)
        }
    ];

    return (
        <div className='w-full h-6/8 py-2 flex flex-col justify-between'>
            <ul className="space-y-2">
                {navItems.map(({ label, path, icon: Icon }) => {
                    const isActive = location.pathname === path
                    return (
                        <li key={label} onClick={() => history.push(path)}
                            className={`w-full flex items-center sm:justify-center lg:justify-start gap-3 sm:gap-0 lg:gap-3 px-3 py-2 rounder-md transition-colors cursor-pointer ${isActive
                                ? 'text-[#2dc8b5] font-semibold'
                                : 'text-gray-400 hover:text-gray-300'
                                }`}>
                            <Icon className="w-5 h-5" />
                            <span className='block sm:hidden lg:block'>{label}</span>
                        </li>
                    )
                })}
            </ul>

            <ul className='my-5 text-sm text-gray-500'>
                {actionItems.map(({ label, icon: Icon, onClick }) => (
                    <li
                        key={label}
                        onClick={onClick}
                        className='w-full flex items-center sm:justify-center lg:justify-start gap-2 sm:gap-0 lg:gap-2 px-3 py-2 cursor-pointer hover:text-gray-400 transition-colors'
                    >
                        <Icon className='w-5 h-5' />
                        <span className='block sm:hidden lg:block'>{label}</span>
                    </li>
                ))}
            </ul>

            <PrivacyPolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
            <TermsOfServiceModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
        </div>
    )
}

export default SidebarMenu