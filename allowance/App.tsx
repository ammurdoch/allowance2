import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Drawer, DrawerItem, IconRegistry } from '@ui-kitten/components';
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
import * as firebase from 'firebase';
import { EvaIconsPack } from '@ui-kitten/eva-icons';


// Optionally import the services that you want to use
import "firebase/auth";
//import "firebase/database";
//import "firebase/firestore";
//import "firebase/functions";
//import "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyALR-rWJJINHwCIUBi7qUmkV5JdcPWtYdg",
  authDomain: "allowance-6d08d.firebaseapp.com",
  databaseURL: "https://allowance-6d08d.firebaseio.com",
  projectId: "allowance-6d08d",
  storageBucket: "allowance-6d08d.appspot.com",
  messagingSenderId: "361336863051",
  appId: "1:361336863051:web:b39f8248d0a0a467cf90ce",
  measurementId: "G-M23YSPTGGE"
};

firebase.initializeApp(firebaseConfig);

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
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <AuthContextProvider>
          {(context: AuthContextType) => (
            <>
              {context.state.isLoading ? <SplashScreen /> : (
                <NavigationContainer>
                  {context.state.userToken ? (
                    <DrawerNavigator />
                  ) : (
                    <Stack.Navigator headerMode='none' initialRouteName="SignIn">
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
    </>
  );
}

export default App;
