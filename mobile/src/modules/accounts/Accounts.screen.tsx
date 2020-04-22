import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import {
  StyleSheet,
  View,
  FlatListProps,
  ListRenderItemInfo,
} from 'react-native';
import {
  Layout,
  Text,
  TopNavigation,
  Divider,
  Spinner,
  Icon,
  TopNavigationAction,
  List,
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as firebase from 'firebase';
import { AuthContext } from '../auth/Auth.context';
import { Account, AccountsScreenNavProp } from './types';
import { FlatList } from 'react-native-gesture-handler';
import AccountsListItem from './AccountsListItem.component';
import PlusIcon from '../common/icons/PlusIcon.component';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type AccountsProps = {
  navigation: AccountsScreenNavProp;
};

const AccountsScreen: React.FunctionComponent<AccountsProps> = props => {
  const { navigation } = props;
  const authContext = React.useContext(AuthContext);
  const [accounts, setAccounts] = React.useState<any>(null);
  React.useEffect(() => {
    if (authContext.state.user) {
      const db = firebase.firestore();
      const unsubscribe = db
        .collection('accounts')
        .where('orgId', '==', authContext.state.user.uid)
        .onSnapshot(function(querySnapshot) {
          const _accounts: any = [];
          querySnapshot.forEach(function(doc) {
            _accounts.push(doc.data());
          });
          setAccounts(_accounts);
        });
      return (): void => unsubscribe();
    }
  }, [authContext.state.user]);

  const renderLoading = (): React.ReactElement => (
    <View style={styles.loading}>
      <Spinner />
    </View>
  );

  const renderAddAccountAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={PlusIcon}
      onPress={(): void => navigation.navigate('CreateAccount')}
    />
  );

  const renderItem = (
    itemProps: ListRenderItemInfo<Account>,
  ): React.ReactElement => (
    <AccountsListItem {...itemProps} navigation={navigation} />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="My Accounts"
        alignment="center"
        accessoryRight={renderAddAccountAction}
      />
      <Divider />
      <Layout style={styles.container}>
        {!accounts && renderLoading()}
        {!!accounts && <List data={accounts} renderItem={renderItem} />}
      </Layout>
    </SafeAreaView>
  );
};

export default AccountsScreen;
