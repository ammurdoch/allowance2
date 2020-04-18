import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
    <View style={styles.container}>
      <Text>Accounts Screen</Text>
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

export default AccountsScreen;