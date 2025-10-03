import {createContext} from 'react';

interface DeviceContext {
  selectedCam: string;
  setSelectedCam: (cam: string) => Promise<any>;
  selectedMic: string;
  setSelectedMic: (mic: string) => Promise<any>;
  selectedSpeaker: string;
  setSelectedSpeaker: (speaker: string) => Promise<any>;
  deviceList: MediaDeviceInfo[];
  setDeviceList: (devices: MediaDeviceInfo[]) => void;
  isChrome: boolean;
}

const DeviceContext = createContext<DeviceContext>({
  selectedCam: '',
  selectedMic: '',
  selectedSpeaker: '',
  deviceList: [],
  setSelectedCam: async () => {},
  setSelectedMic: async () => {},
  setSelectedSpeaker: async () => {},
  setDeviceList: () => {},
  isChrome: false,
});
export default DeviceContext;
