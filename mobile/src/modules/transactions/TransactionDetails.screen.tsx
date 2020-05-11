import {
  Divider,
  MenuItem,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import * as firebase from 'firebase';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import { formatDate } from '../../utils/format-date.utils';
import { Transaction } from '../accounts/types';
import { AuthContext } from '../auth/Auth.context';
import BackIcon from '../common/icons/BackIcon.component';
import DeleteIcon from '../common/icons/DeleteIcon.component';
import LoadingSpinner from '../common/LoadingSpinner.component';
import MyOverflowMenu from '../common/MyOverflowMenu.component';
import DeleteTransaction from './DeleteTransaction.container';
import TransactionForm from './TransactionForm.component';
import {
  TransactionDetailsScreenNavProp,
  TransactionDetailsScreenRouteProp,
} from './types';
import useTransactionDetails from './use-transaction-details.hook';

type TransactionsProps = {
  navigation: TransactionDetailsScreenNavProp;
  route: TransactionDetailsScreenRouteProp;
};

const CreateTransactionScreen: React.FunctionComponent<TransactionsProps> = props => {
  const { navigation, route } = props;
  const authContext = React.useContext(AuthContext);

  const transactionId = route.params.transactionId;
  const [initializing, setInitializing] = React.useState(false);
  const [initErrorMsg, setInitErrorMsg] = React.useState('');
  const transaction = useTransactionDetails(
    authContext,
    transactionId,
    setInitializing,
    setInitErrorMsg,
  );
  if (initErrorMsg) {
    console.error(initErrorMsg);
  }

  const updateTransaction = React.useCallback(
    async (values: Transaction): Promise<string> => {
      const db = firebase.firestore();
      if (transaction) {
        try {
          await db
            .collection('transactions')
            .doc(values.id)
            .update(values);
          const { account } = route.params;
          await db
            .collection('accounts')
            .doc(account.id)
            .update({
              currentBalance:
                account.currentBalance - transaction.amount + values.amount,
            });
        } catch (err) {
          return err.message;
        }
      }
      return '';
    },
    [route.params, transaction],
  );

  const schema = React.useMemo(
    () =>
      Yup.object().shape({
        description: Yup.string().required('Required'),
        amount: Yup.number().required('Required'),
        category: Yup.string().required('Please select a category'),
        type: Yup.string().required('Required'),
      }),
    [],
  );

  const [serverError, setServerError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const userId = React.useMemo(() => {
    if (authContext.state.user) {
      return authContext.state.user.uid;
    }
    return null;
  }, [authContext.state.user]);

  const initialValues = React.useMemo(() => {
    if (transaction) {
      return {
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount.toFixed(2),
        type: transaction.amount > 0 ? 'receive' : 'spend',
      };
    }
  }, [transaction]);

  const onSubmit = React.useCallback(
    async values => {
      setServerError('');
      setLoading(true);
      const { description, amount, category, type } = schema.cast(values);
      const errorMsg = await updateTransaction({
        id: transaction && transaction.id,
        description,
        category: category,
        amount: type === 'spend' ? amount * -1 : amount,
        orgId: userId,
        updatedBy: userId,
        updatedAt: new Date().toISOString(),
      } as Transaction);
      setLoading(false);
      setServerError(errorMsg);
      if (!errorMsg) {
        navigation.goBack();
      }
    },
    [navigation, schema, transaction, updateTransaction, userId],
  );

  const BackAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={(): void => navigation.goBack()}
    />
  );

  const [showDelete, setShowDelete] = React.useState<Transaction | undefined>();

  const onMenuSelect = (row: number): void => {
    if (row === 0) {
      setShowDelete(transaction);
    }
  };

  const renderRightActions = (): React.ReactElement => (
    <MyOverflowMenu onSelect={onMenuSelect}>
      <MenuItem accessoryLeft={DeleteIcon} title="Delete" />
    </MyOverflowMenu>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title={transaction ? transaction.description : 'Activity Details'}
        subtitle={transaction ? formatDate(transaction.createdAt) : undefined}
        alignment="center"
        accessoryLeft={BackAction}
        accessoryRight={renderRightActions}
      />
      <Divider />
      <DeleteTransaction
        showDelete={showDelete}
        setShowDelete={setShowDelete}
        navigation={navigation}
        account={route.params.account}
      />
      {initialValues && (
        <TransactionForm
          navigation={navigation}
          initialValues={initialValues}
          onSubmit={onSubmit}
          schema={schema}
          loading={loading}
          serverError={serverError}
        />
      )}
      {initializing && <LoadingSpinner />}
    </SafeAreaView>
  );
};

export default CreateTransactionScreen;
