import React from 'react';
import ToolbarItem, {ToolbarItemProps} from '../../../atoms/ToolbarItem';
import {TestIconButton} from '../../Navbar';

export interface Props extends Omit<Partial<ToolbarItemProps>, 'children'> {}

export const TestToolbarItem = (props: Props) => {
  return (
    <ToolbarItem testID="videocall-testicon" toolbarProps={props}>
      <TestIconButton />
    </ToolbarItem>
  );
};