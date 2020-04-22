import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import AccountsScreen from './Accounts.screen';
import AccountDetailsScreen from './AccountDetails.screen';
import CreateAccountScreen from './CreateAccount.screen';
import EditAccountScreen from './EditAccount.screen';
import CreateTransactionScreen from './CreateTransaction.screen';
import TransactionDetailsScreen from './TransactionDetails.screen';

const Stack = createStackNavigator();

const AccountsNavigator: React.FunctionComponent = () => (
  <Stack.Navigator headerMode="none" initialRouteName="Accounts">
    <Stack.Screen name="Accounts" component={AccountsScreen} />
    <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
    <Stack.Screen name="AccountDetails" component={AccountDetailsScreen} />
    <Stack.Screen name="EditAccount" component={EditAccountScreen} />
    <Stack.Screen
      name="CreateTransaction"
      component={CreateTransactionScreen}
    />
    <Stack.Screen
      name="TransactionDetails"
      component={TransactionDetailsScreen}
    />
  </Stack.Navigator>
);

export default AccountsNavigator;
