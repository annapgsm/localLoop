// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import Start from './components/Start';
import Chat from './components/Chat';

import { db } from "./firebaseConfig";

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
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