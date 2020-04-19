import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Layout, Text } from '@ui-kitten/components';
import { RootStackParamList } from '../../../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type ForgotPasswordScreenNavProp = StackNavigationProp<
  RootStackParamList,
  'ForgotPassword'
>;

type ForgotPasswordProps = {
  navigation: ForgotPasswordScreenNavProp;
};

const ForgotPasswordScreen: React.FunctionComponent<ForgotPasswordProps> = props => {
  const { navigation } = props;
  return (
    <Layout style={styles.container}>
      <Text>Forgot Password Screen</Text>
      <Button onPress={(): void => navigation.goBack()}>Back to Sign In</Button>
    </Layout>
  );
};

export default ForgotPasswordScreen;
