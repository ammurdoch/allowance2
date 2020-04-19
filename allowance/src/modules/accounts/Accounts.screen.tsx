import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Layout,
  Text,
  TopNavigation,
  Divider,
  Spinner,
} from '@ui-kitten/components';
import { RootStackParamList } from '../../../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as firebase from 'firebase';
import { AuthContext } from '../auth/Auth.context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type AccountsScreenNavProp = StackNavigationProp<
  RootStackParamList,
  'Accounts'
>;

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
      db.collection('accounts')
        .where('ownerId', '==', authContext.state.user.uid)
        .onSnapshot(function(querySnapshot) {
          const _accounts: any = [];
          querySnapshot.forEach(function(doc) {
            _accounts.push([doc.id, doc.data()]);
          });
          setAccounts(_accounts);
        });
    }
  }, [authContext.state.user]);

  const renderLoading = (): React.ReactElement => (
    <View style={styles.loading}>
      <Spinner />
    </View>
  );

  // const renderAddAccountAction = () => (
  //   <TopNavigationAction
  //     icon={MenuIcon}
  //     onPress={() => navigation.navigate()}
  //   />
  // );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="My Accounts"
        alignment="center"
        // accessoryRight={renderAddAccountAction}
      />
      <Divider />
      <Layout style={styles.container}>
        {!accounts && renderLoading()}
        {!!accounts &&
          accounts.map(([id, account]: any) => (
            <Text key={id}>{account.name}</Text>
          ))}
      </Layout>
    </SafeAreaView>
  );
};

export default AccountsScreen;
