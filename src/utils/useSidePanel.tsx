import React, {useState, SetStateAction, useEffect} from 'react';
import {SidePanelType} from '../subComponents/SidePanelEnum';
import {createHook} from 'customization-implementation';
import {LogSource, logger} from '../logger/AppBuilderLogger';

export interface SidePanelContextInterface {
  sidePanel: SidePanelType | string;
  setSidePanel: React.Dispatch<SetStateAction<SidePanelType | string>>;
}

const SidePanelContext = React.createContext<SidePanelContextInterface>({
  sidePanel: SidePanelType.None,
  setSidePanel: () => {},
});

interface SidePanelProviderProps {
  children: React.ReactNode;
}
const SidePanelProvider = (props: SidePanelProviderProps) => {
  const [sidePanel, setSidePanel] = useState<SidePanelType>(SidePanelType.None);

  useEffect(() => {
    logger.log(
      LogSource.Internals,
      'CONTROLS',
      `Side panel changed to -> ${SidePanelType[sidePanel]}`,
    );
  }, [sidePanel]);

  const value = {sidePanel, setSidePanel};
  return (
    <SidePanelContext.Provider value={value}>
      {props.children}
    </SidePanelContext.Provider>
  );
};

/**
 * The Side panel app state governs the side panel.
 */
const useSidePanel = createHook(SidePanelContext);

export {SidePanelProvider, useSidePanel};
