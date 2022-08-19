import axios from "axios";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Detail = ({ route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);

  const onRefresh = useCallback(() => {
    setRefreshing(false);
    getData();
  }, []);

  const getData = () => {
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
      })
      .finally(() => {
        setRefreshing(false);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  return data ? (
    <View style={styles.Body}>
      <ImageBackground
        source={{
          uri: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
        }}
        resizeMode="cover"
        style={styles.Image}
      >
        <ScrollView
          style={styles.View}
          refreshControl={
            <RefreshControl
              colors={["#fff"]}
              tintColor={"#fff"}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <Text style={styles.Text.Heading}>
            {data.title ? data.title : data.name} (
            {moment(
              data.release_date ? data.release_date : data.first_air_date
            ).format("YYYY")}
            )
          </Text>
          <Text style={styles.Text}>
            {moment(
              data.release_date ? data.release_date : data.first_air_date
            ).format("MMMM Do YYYY")}
            {data.production_countries.length > 0 && (
              <Text style={styles.Text}>
                {" "}
                ({data.production_countries[0].iso_3166_1}) &#x2022;
                {data.genres.map((genre, index) => {
                  return (
                    <Text key={index} style={styles.Text}>
                      {" "}
                      {genre.name}
                      {index === data.genres.length - 1 ? " " : ","}
                    </Text>
                  );
                })}{" "}
                {route.params.type === "movie" && (
                  <Text style={styles.Text}>
                    &#x2022; {Math.floor(data.runtime / 60)}hr{" "}
                    {Math.round(data.runtime) % 60}min{" "}
                  </Text>
                )}
                &#x2022; {data.status}
              </Text>
            )}{" "}
          </Text>
          <Text style={styles.Text}>
            {Math.round(data.vote_average * 10 * 100) / 100}% User Score
          </Text>
          <Text style={styles.Text.Heading}>Overview</Text>
          <Text style={styles.Text}>{data.overview}</Text>

          <Text style={styles.Text.Heading}>More Details</Text>
          {route.params.type === "movie" && (
            <Text style={styles.Text}>
              Budget : ${data.budget} , Revenue : ${data.revenue}
            </Text>
          )}
          {route.params.type === "tv" && (
            <Text style={styles.Text}>
              Total Seasons : {data.number_of_seasons} , Total Episodes :{" "}
              {data.number_of_episodes}
            </Text>
          )}
          {route.params.type === "tv" && (
            <>
              <Text style={styles.Text}>
                Last Air Date :{" "}
                {moment(data.last_air_date).format("MMMM Do YYYY")}
              </Text>
              <Text style={styles.Text}>
                Last Episode Name : {data.last_episode_to_air.name}
              </Text>

              {data.next_episode_to_air && (
                <>
                  <Text style={styles.Text}>
                    Next Air Date :{" "}
                    {moment(data.next_episode_to_air.air_date).format(
                      "MMMM Do YYYY"
                    )}
                  </Text>
                  <Text style={styles.Text}>
                    Next Episode Name : {data.next_episode_to_air.name}
                  </Text>
                </>
              )}
            </>
          )}
        </ScrollView>
      </ImageBackground>
    </View>
  ) : (
    <View style={styles.NoBody}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  Body: {
    backgroundColor: "#1B1B1D",
  },
  NoBody: {
    backgroundColor: "#1B1B1D",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  View: { height: "100%", backgroundColor: "rgba(0,0,0,0.7)", padding: 10 },
  Text: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
    Heading: {
      fontSize: 24,
      fontWeight: "bold",
      marginTop: 20,
      color: "#fff",
    },
  },
});

export default Detail;
