import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
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
    <View style={styles.container}>
      <Text>Sign Up Screen</Text>
      <Button
        title="Already have an account?"
        onPress={() => navigation.goBack()}
      />
    </View>
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