import {createContext} from 'react';

interface ColorContext {
  primaryColor: any;
}

const ColorContext = createContext({} as unknown as ColorContext);

export default ColorContext;
