import React, {createContext, SetStateAction} from 'react';
import {createHook} from 'customization-implementation';
import {RoomInfoContextInterface} from './useRoomInfo';

export interface SetRoomInfoContextInterface {
  setRoomInfo: React.Dispatch<SetStateAction<RoomInfoContextInterface>>;
}

const SetRoomInfoContext = createContext<SetRoomInfoContextInterface>({
  setRoomInfo: () => {},
});

interface SetRoomInfoProviderProps {
  children: React.ReactNode;
  value: SetRoomInfoContextInterface;
}

const SetRoomInfoProvider = (props: SetRoomInfoProviderProps) => {
  return (
    <SetRoomInfoContext.Provider value={{...props.value}}>
      {props.children}
    </SetRoomInfoContext.Provider>
  );
};
const useSetRoomInfo = createHook(SetRoomInfoContext);

export {SetRoomInfoProvider, useSetRoomInfo};
