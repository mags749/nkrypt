import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import FolderScreen from "./screens/folders";
import FileScreen from "./screens/files";

const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Folders">
      <Stack.Screen
        name="Folders"
        options={{ headerShown: false }}
        component={FolderScreen}
      />
      <Stack.Screen
        name="Files"
        options={{ headerShown: false }}
        component={FileScreen}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
