import * as React from 'react';
import { AsyncStorage } from 'react-native';
import { AuthContextType } from './types';
import { isFunction, isEmptyChildren } from '../../utils/react.utils';

const initialAuthState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
};

export const AuthContext = React.createContext<AuthContextType>({
  signIn: async () => {},
  signOut: () => {},
  signUp: async () => {},
  state: initialAuthState,
});

interface Props {
  children?: any;
  component?: any;
}

export const AuthContextProvider: React.FunctionComponent<Props> = props => {
  const { component, children } = props;
  const [state, dispatch] = React.useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    initialAuthState,
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async () => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async () => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      state,
    }),
    [state]
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
}
