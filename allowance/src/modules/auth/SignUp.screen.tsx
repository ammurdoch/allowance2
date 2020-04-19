import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Spinner, Text } from '@ui-kitten/components';
import { FormikValues, useFormik } from 'formik';
import * as React from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import * as Yup from 'yup';
import { RootStackParamList } from '../../../types';
import FormikPasswordControl from '../form/FormikPasswordInput.component';
import FormikTextControl from '../form/FormikTextInput.component';
import { AuthContext } from './Auth.context';
import { SignUpValues } from './types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  button1: {
    marginTop: 8,
    marginBottom: 16,
  },
  already: {
    marginBottom: 16,
  },
  button2: {
    marginBottom: 16,
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type SignUpScreenNavProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

type SignUpProps = {
  navigation: SignUpScreenNavProp;
};

const SignUpScreen: React.FunctionComponent<SignUpProps> = props => {
  const { navigation } = props;
  const { signUp } = React.useContext(AuthContext);

  const schema = React.useMemo(
    () =>
      Yup.object().shape({
        email: Yup.string()
          .email()
          .required(),
        password: Yup.string()
          .min(8)
          .required(),
        confirm: Yup.string().oneOf(
          [Yup.ref('password')],
          'Your passwords must match',
        ),
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

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirm: '',
    } as FormikValues,
    onSubmit: async values => {
      setServerError('');
      setLoading(true);
      const errorMsg = await signUp(schema.cast(values) as SignUpValues);
      setLoading(false);
      setServerError(errorMsg);
    },
    validationSchema: schema,
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Text category="h1">Sign Up</Text>
        <FormikTextControl
          name="email"
          label="Email"
          placeholder="Email"
          formikProps={formik}
          icon="email"
          inputProps={{ autoCapitalize: 'none', disabled: loading }}
        />
        <FormikPasswordControl
          name="password"
          label="Password"
          placeholder="Password"
          formikProps={formik}
          icon="lock-outline"
          inputProps={{ autoCapitalize: 'none', disabled: loading }}
        />
        <FormikPasswordControl
          name="confirm"
          label="Confirm Password"
          placeholder="Confirm Password"
          formikProps={formik}
          icon="lock-outline"
          inputProps={{ autoCapitalize: 'none', disabled: loading }}
        />
        {!!serverError && <Text category="danger">{serverError}</Text>}
        <Button
          style={styles.button1}
          status="primary"
          onPress={(): Promise<void> => formik.submitForm()}
          accessoryRight={loading ? LoadingIndicator : undefined}
        >
          Sign Up
        </Button>
        <Text style={styles.already}>Already have an account?</Text>
        <Button
          style={styles.button2}
          status="basic"
          onPress={(): void => navigation.goBack()}
        >
          Sign In
        </Button>
        {/* <Button appearance="ghost" onPress={() => navigation.navigate('ForgotPassword')}>Forgot Password</Button> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
