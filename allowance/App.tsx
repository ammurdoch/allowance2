import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import HomeScreen from './src/modules/home/Home.screen';
import SignInScreen from './src/modules/auth/SignIn.screen';
import SignUpScreen from './src/modules/auth/SignUp.screen';
import ForgotPasswordScreen from './src/modules/auth/ForgotPassword.screen';
import AccountsScreen from './src/modules/accounts/Accounts.screen';
import { AuthContextProvider } from './src/modules/auth/Auth.context';
import { AuthContextType } from './src/modules/auth/types';
import SplashScreen from './src/modules/common/Splash.screen';
import SignOutScreen from './src/modules/auth/SignOut.screen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function App() {
  
  return (
    <AuthContextProvider>
      {(context: AuthContextType) => (
        <>
          {context.state.isLoading ? <SplashScreen /> : (
            <NavigationContainer>
              {context.state.userToken ? (
                <Drawer.Navigator initialRouteName="SignIn">
                  <Drawer.Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />
                  <Drawer.Screen name="Accounts" component={AccountsScreen} options={{ title: "Accounts" }} />
                  <Drawer.Screen name="SignOut" component={SignOutScreen} options={{ title: "SignOut" }} />
                </Drawer.Navigator>
              ) : (
                <Stack.Navigator initialRouteName="SignIn">
                  <Stack.Screen name="SignIn" component={SignInScreen} />
                  <Stack.Screen name="SignUp" component={SignUpScreen} />
                  <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                </Stack.Navigator>
              )}
            </NavigationContainer>
          )}
        </>
      )}
    </AuthContextProvider>
  );
}

export default App;
