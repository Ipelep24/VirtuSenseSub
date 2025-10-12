import React from 'react';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import ThemeConfig from '../../src/theme';

const Loading = (props: {
  text: string;
  background?: string;
  indicatorColor?: string;
  textColor?: string;
}) => {
  const {
    text,
    background = 'rgba(0,0,0,0.9)',
    indicatorColor = $config.PRIMARY_ACTION_BRAND_COLOR,
    textColor = $config.SECONDARY_ACTION_COLOR,
  } = props;

  return (
    <View style={[styles.overlay, {backgroundColor: background}]}>
      <ActivityIndicator size="large" color={indicatorColor} />
      <Text style={[styles.loadingText, {color: textColor}]}>{text}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    zIndex: 2,

    borderRadius: 15,
  },
  loadingText: {
    alignSelf: 'center',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    fontFamily: ThemeConfig.FontFamily.sansPro,
    marginTop: 8,
  },
});

export default Loading;
