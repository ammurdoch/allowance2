import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { RootStackParamList } from '../../../types';

type AccountsScreenNavProp = StackNavigationProp<
  RootStackParamList,
  'Accounts'
>;

type AccountsProps = {
  navigation: AccountsScreenNavProp;
}

const AccountsScreen: React.FunctionComponent<AccountsProps> = () => {
  return (
    <Layout style={styles.container}>
      <Text>Accounts Screen</Text>
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

export default AccountsScreen;