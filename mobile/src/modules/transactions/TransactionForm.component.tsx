import { Button, Layout, Spinner, Text } from '@ui-kitten/components';
import { FormikProps, FormikValues } from 'formik';
import * as React from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import useCategories from '../categories/use-categories.hook';
import FormikSelectControl from '../form/FormikSelectInput.component';
import FormikTextControl from '../form/FormikTextInput.component';
import { CreateTransactionScreenNavProp } from './types';

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
  formik: FormikProps<FormikValues>;
  loading: boolean;
  serverError: string;
};

const TransactionForm: React.FunctionComponent<TransactionsProps> = props => {
  const { navigation, formik, loading, serverError } = props;

  const _categories = useCategories();
  const categories = Object.values(_categories);

  const LoadingIndicator = (loadingProps: any): React.ReactElement => (
    <View style={[loadingProps.style, styles.indicator]}>
      <Spinner status="basic" size="small" />
    </View>
  );

  return (
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
  );
};

export default TransactionForm;
