import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Divider,
  Icon,
  MenuItem,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import * as firebase from 'firebase';
import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import { AuthContext } from '../auth/Auth.context';
import DeleteIcon from '../common/icons/DeleteIcon.component';
import LoadingSpinner from '../common/LoadingSpinner.component';
import MyOverflowMenu from '../common/MyOverflowMenu.component';
import { CreateTransactionScreenNavProp } from '../transactions/types';
import AccountForm from './AccountForm.component';
import DeleteAccount from './DeleteAccount.container';
import { Account, AccountsStackParamList } from './types';
import useAccount from './use-account.hook';

type EditAccountScreenNavProp = StackNavigationProp<
  AccountsStackParamList,
  'EditAccount'
>;

export type EditAccountScreenRouteProp = RouteProp<
  AccountsStackParamList,
  'EditAccount'
>;

type AccountsProps = {
  navigation: EditAccountScreenNavProp;
  route: EditAccountScreenRouteProp;
};

const EditAccountScreen: React.FunctionComponent<AccountsProps> = props => {
  const { navigation, route } = props;
  const authContext = React.useContext(AuthContext);

  const accountId = route.params.accountId;
  const [initializing, setInitializing] = React.useState(false);
  const [initErrorMsg, setInitErrorMsg] = React.useState('');
  const account = useAccount(
    authContext,
    accountId,
    setInitializing,
    setInitErrorMsg,
  );
  if (initErrorMsg) {
    console.error(initErrorMsg);
  }

  const updateAccount = React.useCallback(async (values: Account): Promise<
    string
  > => {
    const db = firebase.firestore();
    try {
      await db
        .collection('accounts')
        .doc(values.id)
        .update(values);
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

  const initialValues = React.useMemo(() => {
    if (account) {
      return {
        name: account.name,
        description: account.description,
        balance: String(account.startingBalance),
      };
    }
  }, [account]);

  const onSubmit = async (values: any): Promise<void> => {
    setServerError('');
    setLoading(true);
    const { name, description, balance } = schema.cast(values);
    const errorMsg = await updateAccount({
      id: account && account.id,
      name,
      description,
      startingBalance: balance,
      currentBalance: balance,
      orgId: userId,
      updatedBy: userId,
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

  const [showDelete, setShowDelete] = React.useState<Account | undefined>();

  const onMenuSelect = (row: number): void => {
    if (row === 0) {
      setShowDelete(account);
    }
  };

  const renderRightActions = (): React.ReactElement => (
    <>
      {account && (
        <MyOverflowMenu onSelect={onMenuSelect}>
          <MenuItem accessoryLeft={DeleteIcon} title="Delete" />
        </MyOverflowMenu>
      )}
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title={account ? account.name : 'Edit Account Details'}
        subtitle={account ? account.description : undefined}
        alignment="center"
        accessoryLeft={BackAction}
        accessoryRight={renderRightActions}
      />
      <Divider />
      <DeleteAccount
        showDelete={showDelete}
        setShowDelete={setShowDelete}
        navigation={navigation}
      />
      {initialValues && (
        <AccountForm
          navigation={navigation as CreateTransactionScreenNavProp}
          initialValues={initialValues}
          onSubmit={onSubmit}
          schema={schema}
          loading={loading}
          serverError={serverError}
          submitText="Save Account"
        />
      )}
      {initializing && <LoadingSpinner />}
    </SafeAreaView>
  );
};

export default EditAccountScreen;
