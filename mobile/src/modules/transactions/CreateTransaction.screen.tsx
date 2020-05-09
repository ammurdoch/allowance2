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
import { AccountsStackParamList, Transaction } from '../accounts/types';
import uuid from 'uuid-random';
import { RouteProp } from '@react-navigation/native';
import FormikSelectControl from '../form/FormikSelectInput.component';
import useCategories from '../categories/use-categories.hook';
import { CreateTransactionScreenNavProp, CreateTransactionScreenRouteProp } from './types';

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
  navigation: CreateTransactionScreenNavProp;
  route: CreateTransactionScreenRouteProp;
};

const CreateTransactionScreen: React.FunctionComponent<TransactionsProps> = props => {
  const { navigation, route } = props;
  const authContext = React.useContext(AuthContext);

  const _categories = useCategories();
  const categories = Object.values(_categories);

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
      description: '',
      category: '',
      amount: '',
      type: '',
    } as FormikValues,
    onSubmit: async values => {
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
        title="New Activity"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <Layout style={styles.container}>
          {/* {console.log('values', formik.values)} */}
          {/* {console.log('errors', formik.errors)} */}
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
          <FormikSelectControl
            name="type"
            label="Did you spend money or receive money?"
            placeholder="Choose an option"
            formikProps={formik}
            icon="swap-outline"
            iconPack="eva"
            inputProps={{
              disabled: loading,
            }}
            options={[
              {
                label: 'Spent money',
                value: 'spend',
              },
              {
                label: 'Received money',
                value: 'receive',
              },
            ]}
          />
          <FormikSelectControl
            name="category"
            label="Category"
            placeholder="Choose a category"
            formikProps={formik}
            icon="shopping-cart"
            iconPack="eva"
            inputProps={{
              disabled: loading,
            }}
            options={categories}
          />
          <FormikTextControl
            name="amount"
            label="Amount"
            placeholder="0.00"
            formikProps={formik}
            icon="currency-usd"
            iconPack="material"
            inputProps={{
              disabled: loading,
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
              Save
            </Button>
          </View>
          {/* <Button appearance="ghost" onPress={() => navigation.navigate('ForgotPassword')}>Forgot Password</Button> */}
        </Layout>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateTransactionScreen;
