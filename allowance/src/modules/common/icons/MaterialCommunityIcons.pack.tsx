import React, { ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface IconProps {
  name: string;
  style: any;
}

function MaterialIcon(props: IconProps): ReactElement {
  const { name, style } = props;
  const { height, tintColor, ...iconStyle } = StyleSheet.flatten(style);
  return (
    <MaterialCommunityIcons
      name={name}
      size={height}
      color={tintColor}
      style={iconStyle}
    />
  );
}

type IconProviderResult = {
  toReactElement: (props: any) => ReactElement;
};

const IconProvider = (name: string): IconProviderResult => ({
  toReactElement: (props: any): ReactElement =>
    MaterialIcon({ name, ...props }),
});

function createIconsMap(): any {
  return new Proxy(
    {},
    {
      get(target: any, name: string): IconProviderResult {
        return IconProvider(name);
      },
    },
  );
}

export const MaterialCommunityIconsPack = {
  name: 'material',
  icons: createIconsMap(),
};
