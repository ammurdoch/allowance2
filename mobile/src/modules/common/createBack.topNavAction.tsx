import * as React from 'react';
import { TopNavigationAction } from '@ui-kitten/components';
import BackIcon from './icons/BackIcon.component';
import { NavigationProp } from '@react-navigation/native';

const createTopNavBackAction = (
  navigation: NavigationProp<any>,
) => (): React.ReactElement => (
  <TopNavigationAction
    icon={BackIcon}
    onPress={(): void => navigation.goBack()}
  />
);

export default createTopNavBackAction;
