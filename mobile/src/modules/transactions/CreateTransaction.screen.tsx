import {
  Divider,
  Icon,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import * as firebase from 'firebase';
import { FormikValues } from 'formik';
import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'uuid-random';
import * as Yup from 'yup';
import { Transaction } from '../accounts/types';
import { AuthContext } from '../auth/Auth.context';
import TransactionForm from './TransactionForm.component';
import {
  CreateTransactionScreenNavProp,
  CreateTransactionScreenRouteProp,
} from './types';

type TransactionsProps = {
  navigation: CreateTransactionScreenNavProp;
  route: CreateTransactionScreenRouteProp;
};

const CreateTransactionScreen: React.FunctionComponent<TransactionsProps> = props => {
  const { navigation, route } = props;
  const authContext = React.useContext(AuthContext);

  const createTransaction = React.useCallback(
    async (values: Transaction): Promise<string> => {
      const db = firebase.firestore();
      try {
        db.collection('transactions')
          .doc(values.id)
          .set(values);
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

  const initialValues: FormikValues = {
    description: '',
    category: '',
    amount: '',
    type: '',
  };
  const onSubmit = async (values: any): Promise<void> => {
    setServerError('');
    setLoading(true);
    const { description, amount, category, type } = schema.cast(values);
    const errorMsg = await createTransaction({
      id: uuid(),
      description,
      category: category,
      amount: type === 'spend' ? amount * -1 : amount,
      accountId: route.params.accountId,
      orgId: userId,
      createdBy: userId,
      updatedBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Transaction);
    setLoading(false);
    setServerError(errorMsg);
    if (!errorMsg) {
      navigation.goBack();
    }
  };

  const BackIcon = (iconProps: any): React.ReactElement => (
    <Icon {...iconProps} name="arrow-back" />
  );

  const BackAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={(): void => navigation.goBack()}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="New Activity"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <TransactionForm
        navigation={navigation}
        initialValues={initialValues}
        onSubmit={onSubmit}
        schema={schema}
        loading={loading}
        serverError={serverError}
      />
    </SafeAreaView>
  );
};

export default CreateTransactionScreen;
