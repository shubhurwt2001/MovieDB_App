import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Detail from "./pages/Detail";
import Home from "./pages/Home";

const Stack = createNativeStackNavigator();

const options = {
  headerRight: (props) => (
    <TouchableOpacity>
      <Icon name="search" size={24} color="#fff"></Icon>
    </TouchableOpacity>
  ),
  headerStyle: {
    backgroundColor: "#b30000",
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
  },
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MovieDB" component={Home} options={options} />
        <Stack.Screen name="Detail" component={Detail} options={options} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
