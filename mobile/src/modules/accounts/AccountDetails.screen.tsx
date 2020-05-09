import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, View, ListRenderItemInfo } from 'react-native';
import {
  Layout,
  Text,
  TopNavigation,
  Divider,
  Spinner,
  Drawer,
  DrawerItem,
  TopNavigationAction,
  List,
  ListItem,
  Button,
} from '@ui-kitten/components';
import { RootStackParamList } from '../../../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as firebase from 'firebase';
import { AuthContext } from '../auth/Auth.context';
import {
  AccountsStackParamList,
  Account,
  Transaction,
  AccountDetailsScreenNavProp,
} from './types';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { RouteProp } from '@react-navigation/native';
import BackIcon from '../common/icons/BackIcon.component';
import TopNavBackAction from '../common/createBack.topNavAction';
import createTopNavBackAction from '../common/createBack.topNavAction';
import ForwardIcon from '../common/icons/ForwardIcon.component';
import PlusIcon from '../common/icons/PlusIcon.component';
import formatMoney from '../../utils/format-money.utils';
import useTransactions from '../transactions/use-transactions.hook';
import settings from '../../settings';
import TransactionListItem from '../transactions/TransactionListItem.component';
import useCategories from '../categories/use-categories.hook';
import { Category, CategoryObject } from '../categories/types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  accountInfo: {
    padding: 16,
    alignItems: 'center',
  },
  description: {
    marginBottom: 16,
  },
  balance: {
    fontWeight: '300',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    paddingVertical: 16,
  },
  activityHeaderPlaceholder: {
    flex: 1,
    flexDirection: 'row',
  },
  activityHeaderTitle: {
    flex: 1,
  },
  addNewButton: {
    marginLeft: 'auto',
  },
});

type AccountDetailsScreenRouteProp = RouteProp<
  AccountsStackParamList,
  'AccountDetails'
>;

type AccountsProps = {
  navigation: AccountDetailsScreenNavProp;
  route: AccountDetailsScreenRouteProp;
};

const AccountDetailsScreen: React.FunctionComponent<AccountsProps> = props => {
  const { navigation, route } = props;
  const authContext = React.useContext(AuthContext);
  const [account, setAccount] = React.useState<Account | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  React.useEffect(() => {
    async function asyncBootstrap(): Promise<void> {
      setLoading(true);
      const db = firebase.firestore();
      try {
        const accountDoc = await db
          .collection('accounts')
          .doc(route.params.accountId)
          .get();
        setAccount(accountDoc.data() as Account);
      } catch (err) {
        setErrorMsg(err.message);
      }
      setLoading(false);
    }
    if (authContext.state.user) {
      asyncBootstrap();
    }
  }, [authContext.state.user, route.params.accountId]);

  const tResult = useTransactions(
    route.params.accountId,
    authContext.state.user,
  );
  const { transactions } = tResult;

  React.useEffect(() => {
    if (!tResult.loading && !tResult.errorMsg && !transactions) {
      console.log('doQuery', tResult);
      tResult.doQuery(settings.pageSize, null);
    }
  }, [tResult, transactions]);

  const renderLoading = (): React.ReactElement => (
    <View style={styles.loading}>
      <Spinner />
    </View>
  );

  const categories = useCategories();

  const renderItem = (
    itemProps: ListRenderItemInfo<Transaction>,
  ): React.ReactElement => (
    // <ListItem
    //   title={itemProps.item.description}
    //   description={itemProps.item.category}
    //   accessoryRight={ForwardIcon}
    //   onPress={(): void => navigation.navigate('TransactionDetails')}
    // />
    <TransactionListItem
      categories={categories}
      item={itemProps.item}
      navigation={navigation}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title={route.params.title}
        alignment="center"
        accessoryLeft={createTopNavBackAction(navigation)}
      />
      <Divider />
      <Layout style={styles.container}>
        {!account && renderLoading()}
        {!!account && (
          <>
            <Layout style={styles.accountInfo} level="2">
              <Text style={styles.description}>{account.description}</Text>
              <Text category="h1" status="primary" style={styles.balance}>
                {formatMoney(account.currentBalance)}
              </Text>
            </Layout>
            <View style={styles.activityHeader}>
              <View style={styles.activityHeaderPlaceholder} />
              <Text category="h2" style={styles.activityHeaderTitle}>
                Activity
              </Text>
              <View style={styles.activityHeaderPlaceholder}>
                {!!transactions && (
                  <Button
                    onPress={(): void =>
                      navigation.navigate('CreateTransaction', {
                        accountId: route.params.accountId,
                      })
                    }
                    style={styles.addNewButton}
                    status="primary"
                    accessoryLeft={PlusIcon}
                    appearance="ghost"
                    size="giant"
                  />
                )}
              </View>
            </View>

            {!transactions && renderLoading()}
            {!!transactions && (
              <>
                <List
                  data={transactions}
                  renderItem={renderItem}
                  onEndReached={(): void => {
                    if (tResult.hasMore) {
                      tResult.doQuery(settings.pageSize, tResult.nextCursor);
                    }
                  }}
                />
              </>
            )}
          </>
        )}
      </Layout>
    </SafeAreaView>
  );
};

export default AccountDetailsScreen;
