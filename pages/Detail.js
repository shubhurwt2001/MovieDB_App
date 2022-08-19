import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const windowHeight = Dimensions.get("window").height;

const Detail = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = useState(false);

  const [data, setData] = useState(null);

  const onRefresh = useCallback(() => {
    setRefreshing(false);
  }, []);

  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/${route.params.type.toLowerCase()}/${
          route.params.id
        }?api_key=5eb0ddc04f2b7e853cc4f375d3b22947`
      )
      .then((data) => {
        setData(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <View style={styles.Body}>
      {data && (
        <ImageBackground
          source={{
            uri: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
          }}
          resizeMode="center"
          style={styles.Image}
          
        >
          <ScrollView
            style={{ height: "100%" }}
            refreshControl={
              <RefreshControl
                colors={["#fff"]}
                tintColor={"#fff"}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          >
            <Text>Hello</Text>
          </ScrollView>
        </ImageBackground>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  Body: {
    backgroundColor: "#1B1B1D",
  },
});

export default Detail;
