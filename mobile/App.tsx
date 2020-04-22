import * as eva from '@eva-design/eva';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  ApplicationProvider,
  Drawer,
  DrawerItem,
  IconRegistry,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { MaterialCommunityIconsPack } from './src/modules/common/icons/MaterialCommunityIcons.pack';
import * as firebase from 'firebase';
// Optionally import the services that you want to use
import 'firebase/auth';
//import "firebase/database";
import 'firebase/firestore';
import * as React from 'react';
import { SafeAreaView } from 'react-native';
import AccountsNavigator from './src/modules/accounts/Accounts.navigator';
import { AuthContextProvider } from './src/modules/auth/Auth.context';
import ForgotPasswordScreen from './src/modules/auth/ForgotPassword.screen';
import SignInScreen from './src/modules/auth/SignIn.screen';
import SignOutScreen from './src/modules/auth/SignOut.screen';
import SignUpScreen from './src/modules/auth/SignUp.screen';
import { AuthContextType } from './src/modules/auth/types';
import SplashScreen from './src/modules/common/Splash.screen';

//import "firebase/functions";
//import "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyALR-rWJJINHwCIUBi7qUmkV5JdcPWtYdg',
  authDomain: 'allowance-6d08d.firebaseapp.com',
  databaseURL: 'https://allowance-6d08d.firebaseio.com',
  projectId: 'allowance-6d08d',
  storageBucket: 'allowance-6d08d.appspot.com',
  messagingSenderId: '361336863051',
  appId: '1:361336863051:web:b39f8248d0a0a467cf90ce',
  measurementId: 'G-M23YSPTGGE',
};

firebase.initializeApp(firebaseConfig);

const Stack = createStackNavigator();
const DrawerNav = createDrawerNavigator();

const DrawerContent = ({ navigation, state }: any): React.ReactElement => (
  <SafeAreaView>
    <Drawer
      selectedIndex={state.index}
      onSelect={(index): any =>
        navigation.navigate(state.routeNames[index.row])
      }
    >
      {/* <DrawerItem title="Home" /> */}
      <DrawerItem title="Accounts" />
      <DrawerItem title="Sign Out" />
    </Drawer>
  </SafeAreaView>
);

const DrawerNavigator: React.FunctionComponent = () => (
  <DrawerNav.Navigator
    drawerContent={(props: any): React.ReactElement => (
      <DrawerContent {...props} />
    )}
    initialRouteName="Accounts"
  >
    <DrawerNav.Screen name="Accounts" component={AccountsNavigator} />
    <DrawerNav.Screen name="SignOut" component={SignOutScreen} />
  </DrawerNav.Navigator>
);

function App(): React.ReactElement {
  return (
    <>
      <IconRegistry icons={[EvaIconsPack, MaterialCommunityIconsPack]} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <AuthContextProvider>
          {(context: AuthContextType): React.ReactElement => (
            <>
              {context.state.isLoading ? (
                <SplashScreen />
              ) : (
                <NavigationContainer>
                  {context.state.user ? (
                    <DrawerNavigator />
                  ) : (
                    <Stack.Navigator
                      headerMode="none"
                      initialRouteName="SignIn"
                    >
                      <Stack.Screen name="SignIn" component={SignInScreen} />
                      <Stack.Screen name="SignUp" component={SignUpScreen} />
                      <Stack.Screen
                        name="ForgotPassword"
                        component={ForgotPasswordScreen}
                      />
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
