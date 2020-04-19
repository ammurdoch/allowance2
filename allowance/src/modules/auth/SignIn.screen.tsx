import { StackNavigationProp } from '@react-navigation/stack';
import { Layout, Text, Button } from '@ui-kitten/components';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { RootStackParamList } from '../../../types';
import { AuthContext } from './Auth.context';

type SignInScreenNavProp = StackNavigationProp<
  RootStackParamList,
  'SignIn'
>;

type SignInProps = {
  navigation: SignInScreenNavProp;
}

const SignInScreen: React.FunctionComponent<SignInProps> = props => {
  const { navigation } = props;
  const { signIn } = React.useContext(AuthContext);
  return (
    <Layout style={styles.container}>
      <Text>Sign In Screen</Text>
      <Button onPress={() => signIn()}>Sign In</Button>
      <Button onPress={() => navigation.navigate('SignUp')}>Sign Up</Button>
      <Button onPress={() => navigation.navigate('ForgotPassword')}>Forgot Password</Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SignInScreen;