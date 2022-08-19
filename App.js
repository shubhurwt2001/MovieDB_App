import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./pages/Home";

const Stack = createNativeStackNavigator();
const App = () => {
  return <NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={Home}
      options={{ title: 'Home' }}
    />
    {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
  </Stack.Navigator>
</NavigationContainer>;
};
export default App;
