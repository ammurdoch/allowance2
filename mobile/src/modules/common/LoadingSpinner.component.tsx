import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Spinner } from '@ui-kitten/components';

const styles = StyleSheet.create({
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
});

const LoadingSpinner: React.FunctionComponent = (): React.ReactElement => (
  <View style={styles.loading}>
    <Spinner />
  </View>
);

export default LoadingSpinner;
