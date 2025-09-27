import React, {createContext} from 'react';
import {createHook} from 'customization-implementation';

export interface CreateContextInterface {
  showShareScreen: () => void;
}

const CreateContext = createContext<CreateContextInterface>({
  showShareScreen: () => {},
});

interface CreateProviderProps {
  value: CreateContextInterface;
  children: React.ReactNode;
}

const CreateProvider = (props: CreateProviderProps) => {
  return (
    <CreateContext.Provider value={{...props.value}}>
      {props.children}
    </CreateContext.Provider>
  );
};
const useCreate = createHook(CreateContext);

export {CreateProvider, useCreate};
