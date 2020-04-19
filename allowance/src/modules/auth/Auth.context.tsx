import * as React from 'react';
import { AsyncStorage } from 'react-native';
import {
  AuthContextType,
  SignInValues,
  AuthState,
  SignUpValues,
} from './types';
import { isFunction, isEmptyChildren } from '../../utils/react.utils';
import * as firebase from 'firebase';

const initialAuthState: AuthState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
};

export const AuthContext = React.createContext<AuthContextType>({
  signIn: async () => '',
  signOut: () => {},
  signUp: async () => '',
  state: initialAuthState,
});

interface Props {
  children?: any;
  component?: any;
}

export const AuthContextProvider: React.FunctionComponent<Props> = props => {
  const { component, children } = props;

  const [state, setState] = React.useState(initialAuthState);

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      // try {
      //   userToken = await AsyncStorage.getItem('userToken');
      // } catch (e) {
      //   // Restoring token failed
      // }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
    };

    // Listen for authentication state to change.
    firebase.auth().onAuthStateChanged(user => {
      setState({
        isLoading: false,
        isSignout: false,
        userToken: user,
      });
    });

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (values: SignInValues) => {
        const { email, password } = values;
        try {
          await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (err) {
          console.log(err.code, err.message);
          return err.message;
        }
        return '';
      },
      signOut: async () => {
        setState({
          ...state,
          isLoading: true,
          isSignout: true,
        });
        await firebase.auth().signOut();
      },
      signUp: async (values: SignUpValues) => {
        const { email, password } = values;
        try {
          await firebase.auth().createUserWithEmailAndPassword(email, password);
        } catch (err) {
          console.log(err.code, err.message);
          return err.message;
        }
        return '';
      },
      state,
    }),
    [state],
  );

  return (
    <AuthContext.Provider value={authContext}>
      {component
        ? React.createElement(component as any, authContext)
        : children // children come last, always called
        ? isFunction(children)
          ? (children as (bag: AuthContextType) => React.ReactNode)(
              authContext as AuthContextType,
            )
          : !isEmptyChildren(children)
          ? React.Children.only(children)
          : null
        : null}
    </AuthContext.Provider>
  );
};
