import * as React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Detail from "./pages/Detail";
import Home from "./pages/Home";
import Search from "./pages/Search";

const Stack = createNativeStackNavigator();

const options = {
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
        <Stack.Screen
          name="MovieDB"
          component={Home}
          options={({ navigation }) => ({
            ...options,
            headerRight: (props) => (
              <TouchableOpacity onPress={() => navigation.navigate("Search")}>
                <Icon name="search" size={24} color="#fff"></Icon>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Details"
          component={Detail}
          options={({ navigation }) => ({
            ...options,
            headerRight: (props) => (
              <TouchableOpacity onPress={() => navigation.navigate("Search")}>
                <Icon name="search" size={24} color="#fff"></Icon>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="Search" component={Search} options={options} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
