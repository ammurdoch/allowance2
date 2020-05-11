import { StackNavigationProp } from '@react-navigation/stack';
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
import { AuthContext } from '../auth/Auth.context';
import AccountForm from './AccountForm.component';
import { Account, AccountsStackParamList } from './types';

type CreateAccountScreenNavProp = StackNavigationProp<
  AccountsStackParamList,
  'CreateAccount'
>;

type AccountsProps = {
  navigation: CreateAccountScreenNavProp;
};

const CreateAccountScreen: React.FunctionComponent<AccountsProps> = props => {
  const { navigation } = props;
  const authContext = React.useContext(AuthContext);

  const createAccount = React.useCallback(async (values: Account): Promise<
    string
  > => {
    const db = firebase.firestore();
    try {
      await db
        .collection('accounts')
        .doc(values.id)
        .set(values);
    } catch (err) {
      return err.message;
    }
    return '';
  }, []);

  const schema = React.useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(),
        description: Yup.string().required(),
        balance: Yup.number().required(),
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
    name: '',
    description: '',
    balance: '',
  };

  const onSubmit = async (values: any): Promise<void> => {
    setServerError('');
    setLoading(true);
    const { name, description, balance } = schema.cast(values);
    const errorMsg = await createAccount({
      id: uuid(),
      name,
      description,
      startingBalance: balance,
      currentBalance: balance,
      orgId: userId,
      createdBy: userId,
      updatedBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Account);
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
        title="Create Account"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <AccountForm
        navigation={navigation}
        initialValues={initialValues}
        onSubmit={onSubmit}
        schema={schema}
        loading={loading}
        serverError={serverError}
        submitText="Create Account"
      />
    </SafeAreaView>
  );
};

export default CreateAccountScreen;
