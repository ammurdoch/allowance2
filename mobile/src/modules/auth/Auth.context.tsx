import * as firebase from 'firebase';
import * as React from 'react';
import { isEmptyChildren, isFunction } from '../../utils/react.utils';
import {
  AuthContextType,
  AuthState,
  SignInValues,
  SignUpValues,
} from './types';

const initialAuthState: AuthState = {
  isLoading: true,
  isSignout: false,
  user: null,
};

export const AuthContext = React.createContext<AuthContextType>({
  signIn: async () => '',
  signOut: () => null,
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
    firebase.auth().onAuthStateChanged(user => {
      console.log('authStateChange', user);
      setState({
        isLoading: false,
        isSignout: false,
        user: user,
      });
    });
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (values: SignInValues): Promise<string> => {
        const { email, password } = values;
        try {
          await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (err) {
          console.log(err.code, err.message);
          return err.message;
        }
        return '';
      },
      signOut: async (): Promise<void> => {
        setState({
          ...state,
          isLoading: true,
          isSignout: true,
        });
        await firebase.auth().signOut();
      },
      signUp: async (values: SignUpValues): Promise<string> => {
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
