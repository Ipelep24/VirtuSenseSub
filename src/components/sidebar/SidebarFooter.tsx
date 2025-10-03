import React from 'react'
import { useAuth } from '../../pages/auth/AuthContext'
import { RxExit } from "react-icons/rx";

const SidebarFooter: React.FC = () => {
    const { googleUser } = useAuth()
    const LogoutIcon = RxExit as React.ComponentType<{ className?: string; onClick?: () => void }>;

    return (
        <div className='flex justify-center items-center flex-col h-1/8 w-full'>
            <div className="relative w-full h-full flex justify-center items-center p-2 gap-2 sm:gap-0 md:gap-2 bg-[#2d2d2d] sm:bg-[#1d1d1d] md:bg-[#2d2d2d] rounded-md">
                <div className="flex items-center gap-2">
                    <img
                        src={googleUser?.photoURL}
                        alt="Profile"
                        width={100}
                        height={100}
                        className="border border-[#2d2d2d] h-8 w-8 rounded-full"
                    />
                    <div className="flex flex-col sm:hidden md:flex">
                        <p className="truncate max-w-[120px] text-white text-sm" title={googleUser?.displayName ?? undefined}>
                            {googleUser?.displayName}
                        </p>
                        <p className="truncate max-w-[120px] text-xs text-gray-400" title={googleUser?.email ?? undefined}>
                            {googleUser?.email}
                        </p>
                    </div>
                </div>
            </div>
            <div 
                className='py-2 mb-2 flex gap-2 items-center justify-center cursor-pointer hover:text-gray-300 transition-colors'
            >
                <LogoutIcon className='w-4 h-4'/>
                <p className='text-sm block sm:hidden md:block'>Logout</p>
            </div>
        </div>
    )
}

export default SidebarFooter