import React, { useState, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { GoHome } from 'react-icons/go';
import { LuList } from 'react-icons/lu';
import { MdReportGmailerrorred, MdOutlinePolicy, MdHelpOutline } from "react-icons/md";
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

interface SidebarMenuProps {
    onMobileClose?: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onMobileClose }) => {
    const location = useLocation();
    const history = useHistory();
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [isRecordsLoading, setIsRecordsLoading] = useState(false);
    const [isRecordsEmpty, setIsRecordsEmpty] = useState(false);

    // Listen for Records loading state
    useEffect(() => {
        const handleLoadingState = (event: CustomEvent) => {
            setIsRecordsLoading(event.detail.isLoading);
            setIsRecordsEmpty(event.detail.isEmpty || false);
        };

        window.addEventListener('recordsLoadingState', handleLoadingState as EventListener);

        return () => {
            window.removeEventListener('recordsLoadingState', handleLoadingState as EventListener);
        };
    }, []);

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
        },
        {
            label: 'Help',
            icon: MdHelpOutline as React.ComponentType<{ className?: string }>,
            onClick: () => {
                const isOnRecords = location.pathname === '/records';
                if (isOnRecords) {
                    // Don't start tour if Records is still loading
                    if (isRecordsLoading) return;
                    
                    // Close mobile sidebar first
                    onMobileClose?.();
                    
                    // Trigger the tour event after a small delay to ensure sidebar closes
                    setTimeout(() => {
                        const helpEvent = new CustomEvent('startRecordsTour');
                        window.dispatchEvent(helpEvent);
                    }, 300);
                }
            }
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
                {actionItems.map(({ label, icon: Icon, onClick }) => {
                    const isOnRecords = location.pathname === '/records';
                    const isOnHome = location.pathname === '/'
                    const isHelpDisabled = label === 'Help' && ((isOnRecords && (isRecordsLoading || isRecordsEmpty)) || isOnHome);
                    
                    return (
                        <li
                            key={label}
                            onClick={isHelpDisabled ? undefined : onClick}
                            className={`w-full flex items-center sm:justify-center lg:justify-start gap-2 sm:gap-0 lg:gap-2 px-3 py-2 transition-colors ${
                                isHelpDisabled 
                                    ? 'cursor-not-allowed opacity-50' 
                                    : 'cursor-pointer hover:text-gray-400'
                            }`}
                            title={isHelpDisabled ? (isRecordsLoading ? 'Please wait for data to load' : isRecordsEmpty ? 'No sessions available for tour' : '') : ''}
                        >
                            <Icon className='w-5 h-5' />
                            <span className='block sm:hidden lg:block'>{label}</span>
                        </li>
                    )
                })}
            </ul>

            <PrivacyPolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
            <TermsOfServiceModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
        </div>
    )
}

export default SidebarMenu