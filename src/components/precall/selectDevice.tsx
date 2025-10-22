import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {isWebInternal} from '../../utils/common';
import SelectDevice from '../../subComponents/SelectDevice';
import {useString} from '../../utils/useString';

export interface DeviceSelectProps {
  isOnPrecall?: boolean;
}
const selectDevice = (props?: DeviceSelectProps) => {
  return <SelectDevice {...props} />;
};

export default selectDevice;
