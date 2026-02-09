// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import Start from './components/Start';
import Chat from './components/Chat';

import { db } from "./firebaseConfig";

import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { Alert, LogBox } from 'react-native';
import { disableNetwork, enableNetwork } from 'firebase/firestore';

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
  //real time network connectivity detection
  const connectionStatus = useNetInfo();
  const isConnected = connectionStatus.isConnected === true;

  useEffect(()=> {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost");
      disableNetwork(db); //disable firestore network when there is no connection 
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  },[connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        >
        </Stack.Screen>

        <Stack.Screen
          name="Chat"
          options={({ route }) => ({
            title: route?.params?.name ?? 'Chat',
          })}
        >
          {(props) => (
            <Chat 
              isConnected={connectionStatus.isConnected}
              {...props} // Passes navigation + route props from React Navigation
              db={db}    
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;