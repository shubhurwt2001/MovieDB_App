import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import DropDownPicker from "react-native-dropdown-picker";

const Home = ({ navigation }) => {
  const [day, setDay] = useState(null);
  const [week, setWeek] = useState(null);
  const [active, setActive] = useState("day");
  const [refreshing, setRefreshing] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getDay(1);
    getWeek(1);
  }, []);

  const getDay = (page) => {
    axios
      .get(
        `https://api.themoviedb.org/3/trending/all/day?api_key=5eb0ddc04f2b7e853cc4f375d3b22947&page=${page}`
      )
      .then((data) => {
        const pagination = new Array(data.data.total_pages)
          .fill("")
          .map((_, i) => {
            return { label: `Page ${i + 1}`, value: i + 1 };
          });
        data.data.pagination = pagination;
        setDay(data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  const getWeek = (page) => {
    axios
      .get(
        `https://api.themoviedb.org/3/trending/all/week?api_key=5eb0ddc04f2b7e853cc4f375d3b22947&page=${page}`
      )
      .then((data) => {
        const pagination = new Array(data.data.total_pages)
          .fill("")
          .map((_, i) => {
            return { label: `Page ${i + 1}`, value: i + 1 };
          });
        data.data.pagination = pagination;
        setWeek(data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (active === "day") {
      getDay(day ? day.page : 1);
    } else {
      getDay(week ? week.page : 1);
    }
  }, [active]);

  const renderItem = (result) => {
    return (
      <View style={styles.List.Card}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Details", {
              id: result.item.id,
              type: result.item.media_type,
            })
          }
        >
          <ImageBackground
            style={styles.List.Card.Image}
            source={{
              uri: `https://image.tmdb.org/t/p/original/${result.item.poster_path}`,
            }}
            resizeMode="cover"
          >
            <View style={styles.List.Card.Info.Parent}>
              <View style={styles.List.Card.Info}>
                <Text style={styles.List.Card.Text}>
                  {result.item.vote_average}
                </Text>
                <Icon name="star" size={18} color="yellow"></Icon>
              </View>
              <View
                style={[
                  styles.List.Card.Info,
                  { justifyContent: "flex-end", width: "auto" },
                ]}
              >
                <Text style={[styles.List.Card.Text]}>
                  {result.item.media_type.toUpperCase()}
                </Text>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.Body}>
      <View style={[styles.Toggler, Platform.OS == "ios" && { zIndex: 9 }]}>
        <View style={styles.Toggler.Inner}>
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
        <View>
          {day && active == "day" && (
            <DropDownPicker
              open={open}
              value={day.page}
              items={day.pagination}
              setOpen={setOpen}
              maxHeight={300}
              placeholder="Page"
              textStyle={styles.selectedTextStyle}
              style={styles.dropdown}
              containerStyle={styles.containerStyle}
              searchable={true}
              searchPlaceholder="Page no."
              onSelectItem={(page) => {
                getDay(page.value);
              }}
            />
          )}

          {week && active == "week" && (
            <DropDownPicker
              open={open}
              value={week.page}
              items={week.pagination}
              setOpen={setOpen}
              maxHeight={300}
              placeholder="Page"
              textStyle={styles.selectedTextStyle}
              style={styles.dropdown}
              containerStyle={styles.containerStyle}
              searchable={true}
              searchPlaceholder="Page no."
              onSelectItem={(page) => {
                getWeek(page.value);
              }}
            />
          )}
        </View>
      </View>
      {!day && active == "day" && (
        <View style={styles.NoBody}>
          <ActivityIndicator size="large" />
        </View>
      )}
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
      {!week && active == "week" && (
        <View style={styles.NoBody}>
          <ActivityIndicator size="large" />
        </View>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Body: {
    backgroundColor: "#1B1B1D",
    // height: "100%",
    marginBottom: 20,
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
        Parent: {
          flexDirection: "row",
          justifyContent: "space-between",
        },
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    Inner: { flexDirection: "row", alignItems: "center" },
    Toggle: {
      width: 100,
      backgroundColor: "#fff",
      padding: 10,
      active: {
        backgroundColor: "#b30000",
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
  selectedTextStyle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  dropdown: {
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    minWidth: 80,
    minHeight: 40,
  },
  NoBody: {
    backgroundColor: "#1B1B1D",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});

export default Home;
