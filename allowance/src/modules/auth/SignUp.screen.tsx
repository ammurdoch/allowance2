import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Layout, Text } from '@ui-kitten/components';
import { RootStackParamList } from '../../../types';

type SignUpScreenNavProp = StackNavigationProp<
  RootStackParamList,
  'SignUp'
>;

type SignUpProps = {
  navigation: SignUpScreenNavProp;
}

const SignUpScreen: React.FunctionComponent<SignUpProps> = props => {
  const { navigation } = props;
  return (
    <Layout style={styles.container}>
      <Text>Sign Up Screen</Text>
      <Button onPress={() => navigation.goBack()}>Already have an account?</Button>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SignUpScreen;