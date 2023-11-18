import React, { useEffect, useState } from "react";
import { View, Image, ScrollView } from "react-native";
import { Button, Card, Text, Searchbar, Appbar } from "react-native-paper";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import useAUthStore from "../hooks/authStore";

const Home = () => {
  const { firstName, logout } = useAUthStore();
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          "https://dinein-phi.vercel.app/api/restaurant"
        );
        const { restaurant } = response.data;
        setRestaurants(restaurant);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRestaurants();
  }, []);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    // Filter restaurants based on search query
    const filteredRestaurants = restaurants.filter((restaurant) =>
      restaurant.location.toLowerCase().includes(query.toLowerCase())
    );
    setRestaurants(filteredRestaurants);
  };

  return (
    <ScrollView>
      <Appbar.Header>
        <Appbar.Action
          icon="logout"
          onPress={() => {
            logout();
            alert("Logout Successful");
          }}
          color="blue"
        />
        <Appbar.Content title="DI" color="blue" />
        <Appbar.Content title={`${firstName}`} />
        <Appbar.Action
          icon="book"
          onPress={() => {
            navigation.navigate("Bookings");
          }}
          color="blue"
        />
      </Appbar.Header>
      <View style={{ margin: 10 }}>
        <Searchbar
          placeholder="Search by restaurant name"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
        <View style={{ marginTop: 10 }}>
          <Image
            source={{
              uri: "https://assets.architecturaldigest.in/photos/6385cf3311f0276636badfb6/16:9/w_2560%2Cc_limit/DSC_8367-Edit-W.png",
            }}
            style={{ width: "100%", height: 200, borderRadius: 20 }}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 20, color: "blue", fontWeight: "700" }}>
            Restaurant Lists
          </Text>
        </View>
        <View style={{ marginTop: 10 }}>
          {restaurants.map((item) => (
            <Card key={item.id}>
              <Card.Cover source={{ uri: item.image }} />
              <Card.Content>
                <View
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    variant="titleLarge"
                    style={{ color: "blue", marginTop: 10 }}
                  >
                    {item.name}
                  </Text>
                  <Text variant="bodyMedium" style={{ marginTop: 5 }}>
                    {item.location}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{ marginTop: 5, color: "green" }}
                  >
                    Number of Available Tables: {item.tables}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{ marginTop: 5, color: "red" }}
                  >
                    Availability:{" "}
                    {item.availability === "OPEN" ? "Available" : "Unavailable"}
                  </Text>
                </View>
              </Card.Content>
              <Card.Actions>
                <Button
                  onPress={() =>
                    navigation.navigate("RestaurantDetail", {
                      id: item.id,
                    })
                  }
                >
                  Reserve Table
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
