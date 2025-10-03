import React, {useState} from 'react';
import {createHook} from 'customization-implementation';

interface ToastContextInterface {
  isActionSheetVisible: boolean;
  setActionSheetVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToastContext = React.createContext<ToastContextInterface>({
  isActionSheetVisible: false,
  setActionSheetVisible: () => {},
});

const ToastProvider = (props: {children: React.ReactNode}) => {
  const [isActionSheetVisible, setActionSheetVisible] = useState(false);

  return (
    <ToastContext.Provider
      value={{
        isActionSheetVisible,
        setActionSheetVisible,
      }}>
      {props.children}
    </ToastContext.Provider>
  );
};

const useToast = createHook(ToastContext);

export {useToast, ToastContext, ToastProvider};
