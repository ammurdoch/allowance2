import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import * as firebase from 'firebase';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import {
  Layout,
  Text,
  TopNavigation,
  Divider,
  Spinner,
  Button,
  TopNavigationAction,
  Icon,
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../auth/Auth.context';
import * as Yup from 'yup';
import FormikTextControl from '../form/FormikTextInput.component';
import { FormikValues, useFormik } from 'formik';
import { AccountsStackParamList, Account } from './types';
import uuid from 'uuid-random';

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
      db.collection('accounts')
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
  const LoadingIndicator = (loadingProps: any): React.ReactElement => (
    <View style={[loadingProps.style, styles.indicator]}>
      <Spinner status="basic" size="small" />
    </View>
  );

  const userId = React.useMemo(() => {
    if (authContext.state.user) {
      return authContext.state.user.uid;
    }
    return null;
  }, [authContext.state.user]);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      balance: '',
    } as FormikValues,
    onSubmit: async values => {
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
    },
    validationSchema: schema,
  });

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
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <Layout style={styles.container}>
          {/* {console.log('values', formik.values)} */}
          {/* {console.log('errors', formik.errors)} */}
          <FormikTextControl
            name="name"
            label="Name"
            placeholder="Name"
            formikProps={formik}
            icon="hash"
            inputProps={{
              disabled: loading,
              size: 'medium',
            }}
          />
          <FormikTextControl
            name="description"
            label="Description"
            placeholder="Description"
            formikProps={formik}
            icon="info"
            inputProps={{
              disabled: loading,
            }}
            multiline
          />
          <FormikTextControl
            name="balance"
            label="Starting Balance"
            placeholder="0.00"
            formikProps={formik}
            icon="currency-usd"
            iconPack="material"
            inputProps={{
              disabled: loading,
              multiline: true,
              keyboardType: 'decimal-pad',
            }}
          />
          {!!serverError && <Text category="danger">{serverError}</Text>}
          <View style={styles.buttonsRow}>
            <Button
              style={styles.button}
              status="basic"
              onPress={(): void => navigation.goBack()}
            >
              Cancel
            </Button>
            <Button
              style={styles.button}
              status="primary"
              onPress={(): Promise<void> => formik.submitForm()}
              accessoryRight={loading ? LoadingIndicator : undefined}
            >
              Create Account
            </Button>
          </View>
          {/* <Button appearance="ghost" onPress={() => navigation.navigate('ForgotPassword')}>Forgot Password</Button> */}
        </Layout>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateAccountScreen;
