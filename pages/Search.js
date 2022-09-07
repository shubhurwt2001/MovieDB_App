import axios from "axios";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Search = ({ navigation }) => {
  const [keyword, setKeyword] = useState("");
  const [timer, setTimer] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    clearInterval(timer);
    if (keyword.length >= 2) {
      axios
        .get(
          `https://api.themoviedb.org/3/search/multi?api_key=5eb0ddc04f2b7e853cc4f375d3b22947&query=${keyword}`
        )
        .then((data) => {
          const getResults = data.data.results.filter((value) => {
            if (value.media_type === "tv" || value.media_type === "movie") {
              return true;
            }
          });
          data.data.results = getResults;
          setResults(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setResults(null);
    }
  }, [keyword]);

  const renderItem = (result) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Details", {
              id: result.item.id,
              type: result.item.media_type,
            })
          }
        >
          <View style={styles.List}>
            <View style={{ flex: 0 }}>
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/original/${result.item.poster_path}`,
                }}
                style={styles.List.Image}
              />
            </View>
            <View style={{ flex: 2 }}>
              <Text style={styles.List.Text}>
                {result.item.title ? result.item.title : result.item.name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.Body}>
      <TextInput
        style={styles.Input}
        onChangeText={setKeyword}
        value={keyword}
      />
      {results ? (
        results.results.length > 0 ? (
          <FlatList
            data={results.results}
            renderItem={renderItem}
            keyExtractor={(result) => result.id}
          />
        ) : (
          <Text style={styles.Text}>No result found</Text>
        )
      ) : (
        <Text style={styles.Text}>Start typing to search</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  Body: {
    backgroundColor: "#1B1B1D",
    height: "100%",
  },
  Input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "#fff",
    color: "#fff",
    padding: 10,
  },
  Text: {
    color: "#fff",
    marginLeft: 10,
  },
  List: {
    marginHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
    Image: {
      height: 50,
      width: 40,
    },
    Text: {
      color: "#fff",
      marginLeft: 10,
    },

  },
});
export default Search;
