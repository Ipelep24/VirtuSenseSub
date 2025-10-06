import React, {createContext, useContext, useEffect, useState} from 'react';
import {createHook} from 'customization-implementation';
import {SdkApiContext} from '../SdkApiContext';
import {useRoomInfo} from '../room-info/useRoomInfo';
import SDKEvents from '../../utils/SdkEvents';
import DeviceContext from '../DeviceContext';
import useSetName from '../../utils/useSetName';

export interface PreCallContextInterface {
  callActive: boolean;
  setCallActive: React.Dispatch<React.SetStateAction<boolean>>;
  error?: any;
  isCameraAvailable?: boolean;
  setCameraAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  isMicAvailable?: boolean;
  setMicAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  isSpeakerAvailable?: boolean;
  setSpeakerAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  isPermissionRequested: boolean;
  setIsPermissionRequested: React.Dispatch<React.SetStateAction<boolean>>;
}

const PreCallContext = createContext<PreCallContextInterface>({
  callActive: false,
  setCallActive: () => {},
  isCameraAvailable: false,
  isMicAvailable: false,
  isSpeakerAvailable: false,
  setCameraAvailable: () => {},
  setMicAvailable: () => {},
  setSpeakerAvailable: () => {},
  isPermissionRequested: false,
  setIsPermissionRequested: () => {},
});

interface PreCallProviderProps {
  value: PreCallContextInterface;
  children: React.ReactNode;
}

const PreCallProvider = (props: PreCallProviderProps) => {
  const {join, enterRoom} = useContext(SdkApiContext);
  const roomInfo = useRoomInfo();
  const {deviceList} = useContext(DeviceContext);
  const setUsername = useSetName();
  const [isCameraAvailable, setCameraAvailable] = useState(false);
  const [isMicAvailable, setMicAvailable] = useState(false);
  const [isSpeakerAvailable, setSpeakerAvailable] = useState(false);
  const [isPermissionRequested, setIsPermissionRequested] = useState(false);

  const value = {
    ...props.value,
    setCameraAvailable,
    isCameraAvailable,
    isMicAvailable,
    setMicAvailable,
    isSpeakerAvailable,
    setSpeakerAvailable,
    isPermissionRequested,
    setIsPermissionRequested,
  };

  useEffect(() => {
    if (join.initialized && join.phrase) {
      if (join.userName) {
        setUsername(join.userName);
      }

      //@ts-ignore
      join?.promise?.res([
        roomInfo.data,
        (userName: string) => {
          return new Promise((res, rej) => {
            setUsername(userName);
            enterRoom.set({res, rej});
            props.value.setCallActive(true);
          });
        },
      ]);
    }

    SDKEvents.emit('ready-to-join', roomInfo.data.meetingTitle, deviceList);
  }, []);

  return (
    <PreCallContext.Provider value={value}>
      {props.children}
    </PreCallContext.Provider>
  );
};
const usePreCall = createHook(PreCallContext);

export {PreCallProvider, usePreCall};
