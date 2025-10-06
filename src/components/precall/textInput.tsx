import React, { useEffect } from 'react';
import { TextStyle } from 'react-native';
import TextInput from '../../atoms/TextInput';
import { useString } from '../../utils/useString';
import { useRoomInfo } from '../room-info/useRoomInfo';
import useSetName from '../../utils/useSetName';
import useGetName from '../../utils/useGetName';
import Input from '../../atoms/Input';
import ThemeConfig from '../../theme';
import { maxInputLimit } from '../../utils/common';
import {
  precallInputGettingName,
  precallNameInputPlaceholderText,
  precallYouAreJoiningAsHeading,
} from '../../language/default-labels/precallScreenLabels';
import { useAuth } from '../../pages/auth/AuthContext';

export interface PreCallTextInputProps {
  labelStyle?: TextStyle;
  textInputStyle?: TextStyle;
  isDesktop?: boolean;
  isOnPrecall?: boolean;
}
const PreCallTextInput = (props?: PreCallTextInputProps) => {
  const placeHolder = useString(precallNameInputPlaceholderText)();
  const joiningAs = useString(precallYouAreJoiningAsHeading)();
  const fetchingNamePlaceholder = useString(precallInputGettingName)();
  const username = useGetName();
  const setUsername = useSetName();
  const { isJoinDataFetched, isInWaitingRoom } = useRoomInfo();
  const { isDesktop = false, isOnPrecall = false } = props;
  const { googleUser } = useAuth()

  useEffect(() => {
    if (googleUser?.displayName) {
      console.log('Setting username from Google:', googleUser.displayName);
      setUsername(googleUser.displayName);
    }
  }, [googleUser?.displayName, setUsername]); // Add setUsername dependency


  return (
    <Input
      maxLength={maxInputLimit}
      label={isOnPrecall ? '' : isDesktop ? joiningAs : ''}
      labelStyle={
        props?.labelStyle
          ? props.labelStyle
          : {
            fontFamily: ThemeConfig.FontFamily.sansPro,
            fontWeight: '400',
            fontSize: ThemeConfig.FontSize.small,
            lineHeight: ThemeConfig.FontSize.small,
            color: $config.FONT_COLOR,
          }
      }
      value={googleUser?.displayName}
      autoFocus
      onChangeText={text => setUsername(text ? text : '')}
      onSubmitEditing={() => { }}
      placeholder={isJoinDataFetched ? placeHolder : fetchingNamePlaceholder}
      editable={false}
    />
  );
};

export default PreCallTextInput;
