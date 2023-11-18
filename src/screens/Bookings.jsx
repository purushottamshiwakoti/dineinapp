import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Appbar, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import useAUthStore from "../hooks/authStore";
import axios from "axios";

const Bookings = () => {
  const { firstName, id } = useAUthStore();
  console.log(id);
  const navigation = useNavigation();
  const [restaurants, setRestaurants] = useState([]);
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          `https://dinein-phi.vercel.app/api/bookings/${id}`
        );
        const { bookedRestaurants } = response.data;
        setRestaurants(bookedRestaurants);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRestaurants();
  }, []);
  console.log(restaurants);
  return (
    <ScrollView>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title={`${firstName} Reservations`} />
      </Appbar.Header>
      <View>
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <Text style={{ color: "blue", fontSize: 20 }}>Your Bookings</Text>
        </View>
        {restaurants.map((item) => (
          <Card key={item.id}>
            <Card.Cover source={{ uri: item.restaurants.image }} />
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
                  {item.restaurants.name}
                </Text>
                <Text variant="bodyMedium" style={{ marginTop: 5 }}>
                  {item.restaurants.location}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ marginTop: 5, color: "green" }}
                >
                  Booked Date:{item.createdAt}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ marginTop: 5, color: "red" }}
                >
                  Availablity:
                  {item.restaurants.availability == "OPEN"
                    ? "Available"
                    : "Unavailable"}
                </Text>
              </View>
            </Card.Content>
            <Card.Actions></Card.Actions>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

export default Bookings;
