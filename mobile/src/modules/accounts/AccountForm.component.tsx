import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Layout, Spinner, Text } from '@ui-kitten/components';
import { FormikValues, useFormik } from 'formik';
import * as React from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import FormikTextControl from '../form/FormikTextInput.component';
import { AccountsStackParamList } from './types';

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
  initialValues: FormikValues;
  onSubmit: any;
  loading: boolean;
  serverError: string;
  schema: any;
  submitText: string;
};

const AccountForm: React.FunctionComponent<AccountsProps> = props => {
  const {
    navigation,
    initialValues,
    onSubmit,
    schema,
    loading,
    serverError,
    submitText,
  } = props;

  const LoadingIndicator = (loadingProps: any): React.ReactElement => (
    <View style={[loadingProps.style, styles.indicator]}>
      <Spinner status="basic" size="small" />
    </View>
  );

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema: schema,
  });

  return (
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
            {submitText}
          </Button>
        </View>
        {/* <Button appearance="ghost" onPress={() => navigation.navigate('ForgotPassword')}>Forgot Password</Button> */}
      </Layout>
    </KeyboardAvoidingView>
  );
};

export default AccountForm;
