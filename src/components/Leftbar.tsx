//@ts-nocheck
import React from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import Toolbar from '../atoms/Toolbar';
import {CustomToolbarMerge, CustomToolbarSorting} from '../utils/common';
import {ToolbarItemHide, ToolbarLeftPresetProps} from '../atoms/ToolbarPreset';
import {filterObject} from '../utils';

const defaultItems: ToolbarLeftPresetProps['items'] = {};

export interface LeftbarProps {
  items?: ToolbarLeftPresetProps['items'];
  includeDefaultItems?: boolean;
}
const Leftbar = (props: LeftbarProps) => {
  const {includeDefaultItems = true, items = {}} = props;
  const {width, height} = useWindowDimensions();

  const isHidden = (hide: ToolbarItemHide = false) => {
    try {
      return typeof hide === 'boolean'
        ? hide
        : typeof hide === 'function'
        ? hide(width, height)
        : false;
    } catch (error) {
      console.log('debugging isHidden error', error);
      return false;
    }
  };

  const mergedItems = CustomToolbarMerge(
    includeDefaultItems ? defaultItems : {},
    items,
  );

  const startItems = filterObject(
    mergedItems,
    ([_, v]) => v?.align === 'start' && !isHidden(v?.hide),
  );
  const centerItems = filterObject(
    mergedItems,
    ([_, v]) => v?.align === 'center' && !isHidden(v?.hide),
  );
  const endItems = filterObject(
    mergedItems,
    ([_, v]) => v?.align === 'end' && !isHidden(v?.hide),
  );

  const startItemsOrdered = CustomToolbarSorting(startItems);
  const centerItemsOrdered = CustomToolbarSorting(centerItems);
  const endItemsOrdered = CustomToolbarSorting(endItems);

  const renderContent = (
    orderedKeys: string[],
    type: 'start' | 'center' | 'end',
  ) => {
    const renderContentItem = [];
    let index = 0;
    orderedKeys.forEach(keyName => {
      index = index + 1;
      let ToolbarComponent = null;
      if (type === 'start') {
        ToolbarComponent = startItems[keyName]?.component;
      } else if (type === 'center') {
        ToolbarComponent = centerItems[keyName]?.component;
      } else {
        ToolbarComponent = endItems[keyName]?.component;
      }
      if (ToolbarComponent) {
        renderContentItem.push(
          <ToolbarComponent key={`top-toolbar-${type}` + index} />,
        );
      }
    });

    return renderContentItem;
  };

  return (
    <Toolbar>
      <View style={style.startContent}>
        {renderContent(startItemsOrdered, 'start')}
      </View>
      <View style={style.centerContent}>
        {renderContent(centerItemsOrdered, 'center')}
      </View>
      <View style={style.endContent}>
        {renderContent(endItemsOrdered, 'end')}
      </View>
    </Toolbar>
  );
};

const style = StyleSheet.create({
  startContent: {
    flex: 1,
    zIndex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    zIndex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endContent: {
    flex: 1,
    zIndex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default Leftbar;
