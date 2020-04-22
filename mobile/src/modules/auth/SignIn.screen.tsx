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
import { SignInValues } from './types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
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
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type SignInScreenNavProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

type SignInProps = {
  navigation: SignInScreenNavProp;
};

const SignInScreen: React.FunctionComponent<SignInProps> = props => {
  const { navigation } = props;
  const { signIn } = React.useContext(AuthContext);

  const schema = React.useMemo(
    () =>
      Yup.object().shape({
        email: Yup.string().required(),
        password: Yup.string().required(),
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
    } as FormikValues,
    onSubmit: async values => {
      setServerError('');
      setLoading(true);
      const errorMsg = await signIn(schema.cast(values) as SignInValues);
      if (errorMsg) {
        setLoading(false);
        setServerError(errorMsg);
      }
    },
    validationSchema: schema,
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Text category="h1">Sign In</Text>
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
        {!!serverError && <Text category="danger">{serverError}</Text>}
        <View style={styles.buttonsRow}>
          <Button
            style={styles.button}
            status="primary"
            onPress={(): Promise<void> => formik.submitForm()}
            accessoryRight={loading ? LoadingIndicator : undefined}
          >
            Sign In
          </Button>
          <Button
            style={styles.button}
            status="basic"
            onPress={(): void => navigation.navigate('SignUp')}
          >
            Sign Up
          </Button>
        </View>
        {/* <Button appearance="ghost" onPress={() => navigation.navigate('ForgotPassword')}>Forgot Password</Button> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;
