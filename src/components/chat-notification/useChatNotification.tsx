import {createHook} from 'customization-implementation';
import React, {SetStateAction, useState, useEffect} from 'react';

export interface individualUnreadMessageCount {
  [key: number]: number;
}

export interface ChatNotificationInterface {
  totalUnreadCount: number;
  unreadGroupMessageCount: number;
  setUnreadGroupMessageCount: React.Dispatch<SetStateAction<number>>;
  unreadPrivateMessageCount: number;
  setUnreadPrivateMessageCount: React.Dispatch<SetStateAction<number>>;
  unreadIndividualMessageCount: individualUnreadMessageCount;
  setUnreadIndividualMessageCount: React.Dispatch<
    SetStateAction<individualUnreadMessageCount>
  >;
}

const ChatNotificationContext = React.createContext<ChatNotificationInterface>({
  totalUnreadCount: 0,
  unreadGroupMessageCount: 0,
  unreadPrivateMessageCount: 0,
  unreadIndividualMessageCount: {},
  setUnreadGroupMessageCount: () => {},
  setUnreadIndividualMessageCount: () => {},
  setUnreadPrivateMessageCount: () => {},
});

interface ChatNotificationProviderProps {
  children: React.ReactNode;
}

const ChatNotificationProvider = (props: ChatNotificationProviderProps) => {
  const [unreadGroupMessageCount, setUnreadGroupMessageCount] = useState(0);
  const [unreadPrivateMessageCount, setUnreadPrivateMessageCount] = useState(0);
  const [unreadIndividualMessageCount, setUnreadIndividualMessageCount] =
    useState<individualUnreadMessageCount>({});

  useEffect(() => {
    let privateUnreadCount = 0;
    for (const key in unreadIndividualMessageCount) {
      privateUnreadCount =
        privateUnreadCount + unreadIndividualMessageCount[key];
    }
    setUnreadPrivateMessageCount(privateUnreadCount);
  }, [unreadIndividualMessageCount]);

  return (
    <ChatNotificationContext.Provider
      value={{
        totalUnreadCount: unreadGroupMessageCount + unreadPrivateMessageCount,
        unreadGroupMessageCount,
        setUnreadGroupMessageCount,
        unreadPrivateMessageCount,
        setUnreadPrivateMessageCount,
        unreadIndividualMessageCount,
        setUnreadIndividualMessageCount,
      }}>
      {props.children}
    </ChatNotificationContext.Provider>
  );
};

const useChatNotification = createHook(ChatNotificationContext);

export {ChatNotificationProvider, useChatNotification};
