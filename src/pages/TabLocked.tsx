import React, { useEffect, useState } from 'react';
import virtuSense from './logo.png'; // Placeholder import

const TabLocked = () => {
  const [canTakeOver, setCanTakeOver] = useState(false);

  useEffect(() => {
    // Check if the active tab is still alive
    const checkActiveTab = () => {
      const activeTab = localStorage.getItem('activeTab');
      const timestamp = parseInt(localStorage.getItem('activeTabTimestamp') || '0');
      const now = Date.now();

      console.log('🔍 TabLocked checking:', {
        activeTab,
        timeSinceUpdate: now - timestamp,
        canTakeOver: !activeTab || (now - timestamp) > 3000
      });

      // If there's no active tab or it hasn't updated in 3+ seconds
      if (!activeTab || (now - timestamp) > 3000) {
        console.log('💡 Active tab appears inactive - can take over');
        setCanTakeOver(true);
      } else {
        setCanTakeOver(false);
      }
    };

    // Check immediately
    checkActiveTab();

    // Check periodically
    const interval = setInterval(checkActiveTab, 1000);

    // Listen for storage events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'activeTab') {
        if (!e.newValue) {
          // Active tab was cleared (closed)
          console.log('💡 Active tab was cleared - can take over');
          setCanTakeOver(true);
        } else {
          // Check if the new active tab is this one
          const currentTabId = sessionStorage.getItem('tabId');
          if (e.newValue === currentTabId) {
            console.log('✅ This tab is now active - redirecting home');
            window.location.href = '/';
          }
        }
      }

      // Logout event
      if (e.key === 'firebaseLogout' || e.key === 'logout-event') {
        console.log('🚪 Logout detected - redirecting to auth');
        window.location.href = '/auth';
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleTakeOver = () => {
    // Get or create tab ID
    let newTabId = sessionStorage.getItem('tabId');
    if (!newTabId) {
      newTabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('tabId', newTabId);
    }

    console.log('💪 Taking over with tab ID:', newTabId);

    // Claim active status
    localStorage.setItem('activeTab', newTabId);
    localStorage.setItem('activeTabTimestamp', Date.now().toString());

    // Redirect to home
    window.location.href = '/';
  };

  const handleCloseTab = () => {
    // Try to close (only works if tab was opened by JavaScript)
    const closed = window.close();
    
    // If close didn't work, show instructions
  };

  return (
    <div className='flex w-screen h-screen gap-10 flex-col items-center justify-center text-white bg-[#0d0d0d]'>
      <div className='w-9/10 sm:w-120 lg:w-130 h-fit max-h-[90%] bg-[#1d1d1d] flex flex-col items-center justify-center p-10 rounded-md outline outline-[#2d2d2d] gap-6' style={{maxWidth: '600px'}}>
        <div className='w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center text-2xl opacity-70'>
          🔒
        </div>
        
        <div className='text-center'>
          <h1 className='text-2xl md:text-3xl font-bold mb-3'>
            Already Active in Another Tab
          </h1>
          <p className='text-gray-400 text-base md:text-lg max-w-md'>
            {canTakeOver 
              ? 'The other tab appears to be closed. You can take over this session.'
              : 'You have an active session in another browser tab. Please close the other tab to continue here.'
            }
          </p>
        </div>

        <div className='flex flex-col gap-3 w-full' style={{maxWidth: '400px'}}>
          <button
            onClick={handleTakeOver}
            className={`px-6 py-3 rounded-md transition-colors text-base md:text-lg font-medium ${
              canTakeOver
                ? 'bg-[#1a7368] hover:bg-[#165b53] text-white cursor-pointer'
                : 'bg-[#2d2d2d] text-gray-500 cursor-not-allowed'
            }`}
            disabled={!canTakeOver}
          >
            {canTakeOver ? 'Use This Tab' : 'Waiting for Other Tab to Close...'}
          </button>
        </div>

        {!canTakeOver && (
          <div className='text-center mt-2'>
            <p className='text-gray-500 text-sm mb-2'>
              Checking for active tab...
            </p>
            <p className='hidden md:block text-gray-600 text-xs'>
              Tip: Press <kbd className='px-2 py-1 bg-[#2d2d2d] rounded text-gray-400'>Ctrl+W</kbd> to close this tab
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabLocked;