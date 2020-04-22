import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { RootStackParamList } from '../../../types';
import { AuthContext } from './Auth.context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type SignOutScreenNavProp = StackNavigationProp<RootStackParamList, 'SignOut'>;

type SignOutProps = {
  navigation: SignOutScreenNavProp;
};

const SignOutScreen: React.FunctionComponent<SignOutProps> = () => {
  const authContext = React.useContext(AuthContext);
  React.useEffect(() => {
    authContext.signOut();
  }, [authContext]);
  return (
    <Layout style={styles.container}>
      <Text>Signing Out ...</Text>
    </Layout>
  );
};

export default SignOutScreen;
