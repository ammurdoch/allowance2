import { RouteProp } from '@react-navigation/native';
import {
  Button,
  Divider,
  Layout,
  List,
  MenuItem,
  Spinner,
  Text,
  TopNavigation,
} from '@ui-kitten/components';
import * as React from 'react';
import { ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import settings from '../../settings';
import formatMoney from '../../utils/format-money.utils';
import { AuthContext } from '../auth/Auth.context';
import useCategories from '../categories/use-categories.hook';
import createTopNavBackAction from '../common/createBack.topNavAction';
import EditIcon from '../common/icons/EditIcon.component copy';
import PlusIcon from '../common/icons/PlusIcon.component';
import MyOverflowMenu from '../common/MyOverflowMenu.component';
import TransactionListItem from '../transactions/TransactionListItem.component';
import useTransactions from '../transactions/use-transactions.hook';
import {
  AccountDetailsScreenNavProp,
  AccountsStackParamList,
  Transaction,
} from './types';
import useSubcribeAccount from './use-subscrıbe-account.hook';

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
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const account = useSubcribeAccount(
    authContext,
    route.params.accountId,
    setLoading,
    setErrorMsg,
  );

  const tResult = useTransactions(
    route.params.accountId,
    authContext.state.user,
  );
  const { transactions } = tResult;

  React.useEffect(() => {
    if (!tResult.loading && !tResult.errorMsg && !transactions) {
      tResult.doQuery(settings.pageSize, null);
    }
  }, [tResult, transactions]);

  const renderLoading = (): React.ReactElement => (
    <View style={styles.loading}>
      <Spinner />
    </View>
  );

  const onMenuSelect = (row: number): void => {
    if (row === 0) {
      navigation.navigate('EditAccount', {
        accountId: account && account.id,
      });
    }
  };

  const renderRightActions = (): React.ReactElement => (
    <>
      {account && (
        <MyOverflowMenu onSelect={onMenuSelect}>
          <MenuItem accessoryLeft={EditIcon} title="Edit" />
        </MyOverflowMenu>
      )}
    </>
  );

  const categories = useCategories();

  const renderItem = (
    itemProps: ListRenderItemInfo<Transaction>,
  ): React.ReactElement => (
    <TransactionListItem
      account={account}
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
        accessoryRight={renderRightActions}
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
                        account,
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
