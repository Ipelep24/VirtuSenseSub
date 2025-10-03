import React from 'react';
import {
  TouchableOpacityProps,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import ThemeConfig from '../theme';
import theme from '../../theme.json';
import {IconsInterface} from '../atoms/CustomIcon';
import ImageIcon from '../atoms/ImageIcon';

export interface PrimaryButtonProps extends TouchableOpacityProps {
  text?: string;
  iconName?: keyof IconsInterface;
  containerStyle?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  iconSize?: number;
  iconColor?: string;
}

export default function PrimaryButton(props: PrimaryButtonProps) {
  const {
    iconName,
    textStyle,
    containerStyle,
    iconSize,
    iconColor = $config.PRIMARY_ACTION_TEXT_COLOR,
    ...otherProps
  } = props;
  return (
    <TouchableOpacity
      style={[
        styles.container,
        props?.disabled
          ? {backgroundColor: $config.SEMANTIC_NEUTRAL}
          : {backgroundColor: $config.PRIMARY_ACTION_BRAND_COLOR},
        containerStyle ? containerStyle : {},
      ]}
      {...otherProps}>
      {iconName ? (
        <View style={{marginRight: 4}}>
          <ImageIcon
            iconType="plain"
            name={iconName}
            tintColor={iconColor}
            iconSize={iconSize}
          />
        </View>
      ) : (
        <></>
      )}
      {props.text && (
        <Text style={[styles.text, textStyle ? textStyle : {}]}>
          {props.text}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  //@ts-ignore
  primaryButton: theme.primaryButton,
  //@ts-ignore
  primaryButtonText: theme.primaryButtonText,
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 52,
    paddingVertical: 18,
    borderRadius: ThemeConfig.BorderRadius.large,
    minWidth: 250,
  },
  text: {
    color: $config.PRIMARY_ACTION_TEXT_COLOR,
    fontSize: ThemeConfig.FontSize.medium,
    fontWeight: '700',
    fontFamily: ThemeConfig.FontFamily.sansPro,
    //paddingLeft: 8,
    textTransform: 'uppercase',
  },
});
