import React from 'react';
import {View} from 'react-native';
import {SidePanelType} from '../subComponents/SidePanelEnum';
import {useSidePanel} from '../utils/useSidePanel';
import {useString} from '../utils/useString';
import IconButton, {IconButtonProps} from '../atoms/IconButton';
import {useToolbarMenu} from '../utils/useMenu';
import ToolbarMenuItem from '../atoms/ToolbarMenuItem';
import {useActionSheet} from '../utils/useActionSheet';
import {toolbarItemSettingText} from '../language/default-labels/videoCallScreenLabels';
import {useToolbarProps} from '../atoms/ToolbarItem';

export interface SettingsIconButtonProps {
  render?: (onPress: () => void, isPanelActive: boolean) => JSX.Element;
}

const Settings = (props: SettingsIconButtonProps) => {
  const {label = null, onPress: onPressCustom = null} = useToolbarProps();
  const {sidePanel, setSidePanel} = useSidePanel();
  const {isToolbarMenuItem} = useToolbarMenu();
  const settingsLabel = useString(toolbarItemSettingText)();

  const isPanelActive = sidePanel === SidePanelType.Settings;
  const onPress = () => {
    isPanelActive
      ? setSidePanel(SidePanelType.None)
      : setSidePanel(SidePanelType.Settings);
  };
  const {isOnActionSheet, showLabel} = useActionSheet();
  let iconButtonProps: IconButtonProps = {
    onPress: onPressCustom || onPress,

    iconProps: {
      name: 'settings',
      tintColor: isPanelActive
        ? $config.PRIMARY_ACTION_TEXT_COLOR
        : $config.SECONDARY_ACTION_COLOR,
      iconBackgroundColor: isPanelActive
        ? $config.PRIMARY_ACTION_BRAND_COLOR
        : '',
    },
    btnTextProps: {
      text: showLabel ? label || settingsLabel : '',
      textColor: $config.FONT_COLOR,
    },
  };
  iconButtonProps.isOnActionSheet = isOnActionSheet;
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
  return props?.render ? (
    props.render(onPress, isPanelActive)
  ) : (
    <>
      <View>
        {isToolbarMenuItem ? (
          <ToolbarMenuItem {...iconButtonProps} />
        ) : (
          <IconButton {...iconButtonProps} />
        )}
      </View>
    </>
  );
};

export const SettingsWithViewWrapper = (props: SettingsIconButtonProps) => {
  return <Settings {...props} />;
};

export default Settings;
