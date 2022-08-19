import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  FlatList,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const Home = () => {
  const [day, setDay] = useState(null);
  const [week, setWeek] = useState(null);
  const [active, setActive] = useState("day");
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/trending/all/day?api_key=5eb0ddc04f2b7e853cc4f375d3b22947`
      )
      .then((data) => {
        setDay(data.data);
        // console.log(data.data);
      });

    axios
      .get(
        `https://api.themoviedb.org/3/trending/all/week?api_key=5eb0ddc04f2b7e853cc4f375d3b22947`
      )
      .then((data) => {
        setWeek(data.data);
      });
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    console.log(
      `https://api.themoviedb.org/3/trending/all/${active}?api_key=5eb0ddc04f2b7e853cc4f375d3b22947`
    );
    axios
      .get(
        `https://api.themoviedb.org/3/trending/all/${active}?api_key=5eb0ddc04f2b7e853cc4f375d3b22947`
      )
      .then((data) => {
        if (active === "day") {
          setDay(data.data);
        } else {
          setWeek(data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setRefreshing(false);
      });
  }, [active]);

  const renderItem = (result) => {
    return (
      <View style={styles.List.Card}>
        <ImageBackground
          style={styles.List.Card.Image}
          source={{
            uri: `https://image.tmdb.org/t/p/original/${result.item.poster_path}`,
          }}
          resizeMode="cover"
        >
          <View style={styles.List.Card.Info}>
            <Text style={styles.List.Card.Text}>
              {result.item.vote_average}
            </Text>
            <Icon name="star" size={18} color="yellow"></Icon>
          </View>
        </ImageBackground>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.Body}>
      <View style={styles.Header}>
        <Text style={styles.Header.Text}>
          Movie<Text style={styles.Header.Text.DB}>DB</Text>
        </Text>
        <TouchableOpacity>
          <Icon name="search" size={24} color="#fff"></Icon>
        </TouchableOpacity>
      </View>
      <View style={styles.Toggler}>
        <TouchableOpacity onPress={() => setActive("day")}>
          <View
            style={[
              styles.Toggler.Toggle,
              active == "day" && styles.Toggler.Toggle.active,
            ]}
          >
            <Text
              style={[
                styles.Toggler.Toggle.Text,
                active == "day" && styles.Toggler.Toggle.Text.active,
              ]}
            >
              Day
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActive("week")}>
          <View
            style={[
              styles.Toggler.Toggle,
              active == "week" && styles.Toggler.Toggle.active,
            ]}
          >
            <Text
              style={[
                styles.Toggler.Toggle.Text,
                active == "week" && styles.Toggler.Toggle.Text.active,
              ]}
            >
              Week
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {active == "day" && day && (
        <FlatList
          data={day.results}
          renderItem={renderItem}
          style={styles.List}
          keyExtractor={(result) => result.id}
          numColumns={2}
          refreshControl={
            <RefreshControl
              colors={["#fff"]}
              tintColor={"#fff"}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
      {active == "week" && week && (
        <FlatList
          data={week.results}
          renderItem={renderItem}
          style={styles.List}
          keyExtractor={(result) => result.id}
          numColumns={2}
          refreshControl={
            <RefreshControl
              colors={["#fff"]}
              tintColor={"#fff"}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
      <StatusBar style="light" animated={true} backgroundColor="#61dafb" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Body: {
    backgroundColor: "#1B1B1D",
    height: "100%",
  },
  Header: {
    padding: 5,
    borderBottomColor: "#fff",
    borderBottomWidth: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    Text: {
      fontSize: 22,
      color: "#fff",
      DB: {
        color: "red",
      },
    },
  },

  List: {
    Card: {
      width: "50%",
      padding: 10,
      Text: {
        fontSize: 14,
        color: "#fff",
      },
      Image: {
        width: "100%",
        height: 250,
      },
      Info: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: 5,
        width: 70,
        justifyContent: "space-between",
      },
    },
  },
  Toggler: {
    flexDirection: "row",
    padding: 10,
    Toggle: {
      width: 100,
      backgroundColor: "#fff",
      padding: 10,
      active: {
        backgroundColor: "red",
      },
      Text: {
        fontSize: 16,
        textAlign: "center",
        fontWeight: "bold",
        active: {
          color: "#fff",
        },
      },
    },
  },
});

export default Home;
