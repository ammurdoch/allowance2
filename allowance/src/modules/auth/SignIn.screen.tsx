import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
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
    <View style={styles.container}>
      <Text>Sign In Screen</Text>
      <Button
        title="Sign In"
        onPress={() => signIn()}
      />
      <Button
        title="Sign Up"
        onPress={() => navigation.navigate('SignUp')}
      />
      <Button
        title="Forgot Password"
        onPress={() => navigation.navigate('SignUp')}
      />
    </View>
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