import React, { useEffect, useRef } from 'react';
import { auth } from '../firebase';
import { useHistory, useLocation } from '../components/Router';
import Toast from '../../react-native-toast-message';

const SingleSessionEnforcer = () => {
  const history = useHistory();
  const location = useLocation();
  const tabIdRef = useRef<string | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isLockedRef = useRef(false);
  const listenersAttachedRef = useRef(false);

  useEffect(() => {
    const user = auth.currentUser;
    
    // Skip setup on auth page or if no user
    if (!user || location.pathname === '/auth') {
      return;
    }

    // ALWAYS check if tab is locked on every route change
    if (isLockedRef.current && location.pathname !== '/tab-locked') {
      console.log('🔒 Tab is locked - forcing redirect to /tab-locked');
      history.replace('/tab-locked');
      return;
    }

    // On /tab-locked page, don't do enforcement checks (but keep monitoring)
    if (location.pathname === '/tab-locked') {
      // Still need to set up listeners if not already done
      if (!listenersAttachedRef.current) {
        setupMonitoring();
      }
      return;
    }

    // Get or create tab ID
    let tabId = sessionStorage.getItem('tabId');
    if (!tabId) {
      tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('tabId', tabId);
    }
    tabIdRef.current = tabId;

    // ALWAYS check for existing active tab on route change
    const existingTab = localStorage.getItem('activeTab');
    const existingTimestamp = parseInt(localStorage.getItem('activeTabTimestamp') || '0');
    const now = Date.now();

    // If there's a different active tab that's recent, LOCK this tab
    if (existingTab && existingTab !== tabId && (now - existingTimestamp) < 3000) {
      console.log('⚠️ Another active tab detected - LOCKING this tab permanently');
      isLockedRef.current = true;
      
      Toast.show({
        leadingIconName: 'alert',
        type: 'warning',
        text1: 'Session Already Active',
        text2: 'Please use the existing tab or close it first.',
        visibilityTime: 3000,
      });

      setTimeout(() => {
        history.replace('/tab-locked');
      }, 500);
      return;
    }

    // Claim this tab as active
    claimActiveTab(tabId);

    // Set up monitoring if not already done
    if (!listenersAttachedRef.current) {
      setupMonitoring();
    }

    function setupMonitoring() {
      listenersAttachedRef.current = true;

      // Listen for storage changes
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'firebaseLogout' || e.key === 'logout-event') {
          console.log('🚪 Logout detected from another tab');
          if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
          }
          history.replace('/auth');
          return;
        }

        // Another tab claimed active status
        if (e.key === 'activeTab' && e.newValue) {
          const currentTabId = tabIdRef.current;
          const newActiveTab = e.newValue;
          
          if (newActiveTab !== currentTabId && !isLockedRef.current) {
            console.log('⚠️ Another tab claimed active status - LOCKING this tab');
            isLockedRef.current = true;
            
            if (heartbeatIntervalRef.current) {
              clearInterval(heartbeatIntervalRef.current);
            }

            Toast.show({
              leadingIconName: 'alert',
              type: 'warning',
              text1: 'Session Moved',
              text2: 'You are now active in another tab.',
              visibilityTime: 1500,
            });

            setTimeout(() => {
              history.replace('/tab-locked');
            }, 1500);
          }
        }
      };

      window.addEventListener('storage', handleStorageChange);

      // Heartbeat: maintain active status or detect when locked
      heartbeatIntervalRef.current = setInterval(() => {
        const currentTabId = tabIdRef.current;
        const activeTab = localStorage.getItem('activeTab');
        
        if (isLockedRef.current) {
          // Tab is locked, check if we should redirect
          if (location.pathname !== '/tab-locked') {
            console.log('🔒 Locked tab detected in heartbeat - redirecting');
            history.replace('/tab-locked');
          }
          return;
        }
        
        if (activeTab === currentTabId) {
          // We're still active, update timestamp
          claimActiveTab(currentTabId);
        } else if (activeTab && activeTab !== currentTabId) {
          // Someone else is active, LOCK this tab
          console.log('⚠️ Lost active status in heartbeat - LOCKING tab');
          isLockedRef.current = true;
          
          if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
          }

          history.replace('/tab-locked');
        }
      }, 500);

      // Handle visibility change
      const handleVisibilityChange = () => {
        if (isLockedRef.current) return;

        if (!document.hidden) {
          const currentTabId = tabIdRef.current;
          const activeTab = localStorage.getItem('activeTab');
          
          if (activeTab !== currentTabId) {
            const timestamp = parseInt(localStorage.getItem('activeTabTimestamp') || '0');
            const now = Date.now();
            
            // If active tab is stale (5+ seconds), take over
            if (now - timestamp > 5000) {
              console.log('💪 Taking over from stale tab (user returned)');
              isLockedRef.current = false;
              claimActiveTab(currentTabId);
              
              Toast.show({
                leadingIconName: 'spotlight',
                type: 'success',
                text1: 'Session Reactivated',
                text2: 'This tab is now active.',
                visibilityTime: 2000,
              });

              // If we're on tab-locked page, redirect to home
              if (location.pathname === '/tab-locked') {
                history.replace('/');
              }
            }
          }
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Cleanup on tab close
      const handleBeforeUnload = () => {
        const currentTabId = tabIdRef.current;
        const activeTab = localStorage.getItem('activeTab');
        
        if (currentTabId === activeTab) {
          localStorage.removeItem('activeTab');
          localStorage.removeItem('activeTabTimestamp');
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    // Cleanup function runs on unmount
    return () => {
      // Don't clean up listeners - they should persist across route changes
      // Only clean up on actual component unmount (user closes tab or logs out)
    };
  }, [history, location.pathname]);

  const claimActiveTab = (tabId: string) => {
    localStorage.setItem('activeTab', tabId);
    localStorage.setItem('activeTabTimestamp', Date.now().toString());
  };

  return null;
};

export default SingleSessionEnforcer;