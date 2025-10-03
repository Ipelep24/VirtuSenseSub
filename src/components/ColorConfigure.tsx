import React from 'react';
import ColorContext from './ColorContext';

const ColorConfigure = (props: {children: React.ReactNode}) => {
  const primaryColor = $config.PRIMARY_ACTION_BRAND_COLOR;
  return (
    <ColorContext.Provider
      value={{
        primaryColor: primaryColor,
      }}>
      {props.children}
    </ColorContext.Provider>
  );
};

export default ColorConfigure;
