import React from 'react';
import TertiaryButton from '../atoms/TertiaryButton';
import IconButton, {IconButtonProps} from '../atoms/IconButton';
import {useVideoCall} from '../components/useVideoCall';
import {useToolbarMenu} from '../utils/useMenu';
import ToolbarMenuItem from '../atoms/ToolbarMenuItem';
import {useActionSheet} from '../utils/useActionSheet';
import {useString} from '../utils/useString';
import {toolbarItemInviteText} from '../language/default-labels/videoCallScreenLabels';
import {useToolbarProps} from '../atoms/ToolbarItem';

export interface CopyJoinInfoProps {
  showTeritaryButton?: boolean;
  render?: (onPress: () => void) => JSX.Element;
}

const CopyJoinInfo = (props: CopyJoinInfoProps) => {
  const {label = null, onPress: onPressCustom = null} = useToolbarProps();
  const {isOnActionSheet, showLabel} = useActionSheet();
  const {isToolbarMenuItem} = useToolbarMenu();

  const {showTeritaryButton = false} = props;
  const copyMeetingInviteButton = useString(toolbarItemInviteText)();
  const {setShowInvitePopup} = useVideoCall();

  const onPress = () => {
    setShowInvitePopup(true);
  };
  let iconButtonProps: IconButtonProps = {
    onPress: onPressCustom || onPress,
    iconProps: {
      name: 'share',
      tintColor: $config.SECONDARY_ACTION_COLOR,
    },
    btnTextProps: {
      textColor: $config.FONT_COLOR,
      text: showLabel ? label || copyMeetingInviteButton : '',
    },
  };

  if (isOnActionSheet) {
    iconButtonProps.btnTextProps.textStyle = {
      color: $config.FONT_COLOR,
      marginTop: 8,
      fontSize: 12,
      fontWeight: '400',
      fontFamily: 'Source Sans Pro',
      textAlign: 'center',
    };
  }
  iconButtonProps.isOnActionSheet = isOnActionSheet;

  return props?.render ? (
    props.render(onPress)
  ) : (
    <>
      {showTeritaryButton ? (
        <TertiaryButton text={copyMeetingInviteButton} onPress={onPress} />
      ) : isToolbarMenuItem ? (
        <ToolbarMenuItem {...iconButtonProps} />
      ) : (
        <IconButton {...iconButtonProps} />
      )}
    </>
  );
};

export default CopyJoinInfo;
