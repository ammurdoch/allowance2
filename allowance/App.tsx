import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Drawer, DrawerItem } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native';
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
const { Navigator, Screen } = createDrawerNavigator();

const DrawerContent = ({ navigation, state }: any) => (
  <SafeAreaView>
    <Drawer
      selectedIndex={state.index}
      onSelect={index => navigation.navigate(state.routeNames[index.row])}>
      
        <DrawerItem title='Home' />
        <DrawerItem title='Accounts' />
        <DrawerItem title='SignOut' />
      
    </Drawer>
  </SafeAreaView>
);

const DrawerNavigator = () => (
  <Navigator drawerContent={props => <DrawerContent {...props}/>} initialRouteName="Home">
    <Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />
    <Screen name="Accounts" component={AccountsScreen} options={{ title: "Accounts" }} />
    <Screen name="SignOut" component={SignOutScreen} options={{ title: "SignOut" }} />
  </Navigator>
);

function App() {
  
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <AuthContextProvider>
        {(context: AuthContextType) => (
          <>
            {context.state.isLoading ? <SplashScreen /> : (
              <NavigationContainer>
                {context.state.userToken ? (
                  <DrawerNavigator />
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
    </ApplicationProvider>
  );
}

export default App;
