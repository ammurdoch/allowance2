import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../../types';

type ForgotPasswordScreenNavProp = StackNavigationProp<
  RootStackParamList,
  'ForgotPassword'
>;

type ForgotPasswordProps = {
  navigation: ForgotPasswordScreenNavProp;
}

const ForgotPasswordScreen: React.FunctionComponent<ForgotPasswordProps> = props => {
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <Text>Forgot Password Screen</Text>
      <Button
        title="Back to Sign In"
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

export default ForgotPasswordScreen;
