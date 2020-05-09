import {
  Divider,
  Icon,
  TopNavigation,
  TopNavigationAction,
  OverflowMenu,
  MenuItem,
} from '@ui-kitten/components';
import * as firebase from 'firebase';
import { FormikValues, useFormik } from 'formik';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'uuid-random';
import * as Yup from 'yup';
import { Transaction } from '../accounts/types';
import { AuthContext } from '../auth/Auth.context';
import TransactionForm from './TransactionForm.component';
import {
  TransactionDetailsScreenNavProp,
  TransactionDetailsScreenRouteProp,
} from './types';
import useTransactionDetails from './use-transaction-details.hook';
import LoadingSpinner from '../common/LoadingSpinner.component';
import { formatDate } from '../../utils/format-date.utils';
import MenuIcon from '../common/icons/MenuIcon.component';
import DeleteIcon from '../common/icons/DeleteIcon.component';
import BackIcon from '../common/icons/BackIcon.component';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginLeft: 4,
    marginRight: 4,
  },
  buttonsRow: {
    marginTop: 8,
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

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
  console.log('transaction', transactionId, transaction);

  const updateTransaction = React.useCallback(
    async (values: Transaction): Promise<string> => {
      const db = firebase.firestore();
      try {
        db.collection('transactions')
          .doc(values.id)
          .update(values);
      } catch (err) {
        return err.message;
      }
      return '';
    },
    [],
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

  const [menuVisible, setMenuVisible] = React.useState(false);

  const toggleMenu = (): void => {
    setMenuVisible(!menuVisible);
  };

  const renderMenuAction = (): React.ReactElement => (
    <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
  );

  const renderRightActions = (): React.ReactElement => (
    <>
      <OverflowMenu
        anchor={renderMenuAction}
        visible={menuVisible}
        onBackdropPress={toggleMenu}
      >
        <MenuItem accessoryLeft={DeleteIcon} title="Delete" />
      </OverflowMenu>
    </>
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
