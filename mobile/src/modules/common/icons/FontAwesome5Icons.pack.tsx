import React, { ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface IconProps {
  name: string;
  style: any;
}

function FontAwesome5Icon(props: IconProps): ReactElement {
  const { name, style } = props;
  const { height, tintColor, ...iconStyle } = StyleSheet.flatten(style);
  return (
    <FontAwesome5
      name={name}
      size={height - 7}
      color={tintColor}
      style={{
        ...iconStyle,
        paddingVertical: (iconStyle.paddingVertical || 0) + 2,
        paddingHorizontal: (iconStyle.paddingHorizontal || 0) + 1,
      }}
    />
  );
}

type IconProviderResult = {
  toReactElement: (props: any) => ReactElement;
};

const IconProvider = (name: string): IconProviderResult => ({
  toReactElement: (props: any): ReactElement =>
    FontAwesome5Icon({
      name,
      ...props,
    }),
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

export const FontAwesome5IconsPack = {
  name: 'font-awesome',
  icons: createIconsMap(),
};
