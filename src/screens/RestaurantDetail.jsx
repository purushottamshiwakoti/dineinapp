import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Button, Appbar, Card, TextInput } from "react-native-paper";
import { TimePickerModal } from "react-native-paper-dates";

import { DatePickerModal } from "react-native-paper-dates";
import useAUthStore from "../hooks/authStore";

// import DateTimePickerModal from "react-native-modal-datetime-picker";

const RestaurantDetail = ({ route }) => {
  const auth = useAUthStore();
  const userId = auth.id;
  console.log(userId);
  const [restaurant, setRestaurant] = useState();
  const [visible, setVisible] = React.useState(false);
  const onDismiss = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);
  const [date, setDate] = React.useState(undefined);
  const [hours, setHours] = React.useState(undefined);
  const [minutes, setMinutes] = React.useState(undefined);
  const [open, setOpen] = React.useState(false);

  console.log({ date });
  console.log({ hours });
  console.log({ minutes });

  const onConfirm = React.useCallback(
    ({ hours, minutes }) => {
      setVisible(false);
      setHours(hours);
      setMinutes(minutes);
    },
    [setVisible]
  );

  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = React.useCallback(
    (params) => {
      setOpen(false);
      setDate(params.date);
    },
    [setOpen, setDate]
  );

  const { id } = route.params;
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          `https://dinein-phi.vercel.app/api/restaurant/${id}`
        );
        console.log(response.data);
        const { restaurant } = response.data;
        setRestaurant(restaurant);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRestaurants();
  }, []);
  const navigation = useNavigation();
  const handleBook = async () => {
    try {
      const response = await axios.post(
        "https://dinein-phi.vercel.app/api/bookings",
        {
          hours,
          minutes,
          restaurantId: id,
          userId,
          date,
        }
      );
      const { message } = response.data;
      alert(message);

      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ScrollView>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title="Reserve Table" />
      </Appbar.Header>
      <View>
        {restaurant && (
          <>
            <Card key={restaurant.id}>
              <Card.Cover source={{ uri: restaurant.image }} />
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
                    {restaurant.name}
                  </Text>
                  <Text variant="bodyMedium" style={{ marginTop: 5 }}>
                    {restaurant.location}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{ marginTop: 5, color: "green" }}
                  >
                    Number of Available Tables:{restaurant.tables}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{ marginTop: 5, color: "red" }}
                  >
                    Availablity:
                    {restaurant.availability == "OPEN"
                      ? "Available"
                      : "Unavailable"}
                  </Text>
                </View>
              </Card.Content>
              <Card.Actions></Card.Actions>
            </Card>
            {restaurant.availability === "OPEN" && restaurant.tables > 0 && (
              <View style={{ margin: 8 }}>
                {hours && minutes && (
                  <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 18 }}>
                      Selected Time: {hours}:{minutes}
                    </Text>
                  </View>
                )}
                <Button
                  onPress={() => setVisible(true)}
                  uppercase={false}
                  mode="outlined"
                >
                  Pick time
                </Button>
                {date && (
                  <View style={{}}>
                    <Text style={{ fontSize: 18, textAlign: "center" }}>
                      Selected Date: {date.toDateString()}
                    </Text>
                  </View>
                )}
                <TimePickerModal
                  visible={visible}
                  onDismiss={onDismiss}
                  onConfirm={onConfirm}
                  hours={12}
                  minutes={14}
                />
                {/* {date && <TextInput placeholder="Date" />} */}
                <Button
                  style={{ marginTop: 10 }}
                  onPress={() => setOpen(true)}
                  uppercase={false}
                  mode="outlined"
                >
                  Pick single date
                </Button>
                <DatePickerModal
                  locale="en"
                  mode="single"
                  visible={open}
                  onDismiss={onDismissSingle}
                  date={date}
                  onConfirm={onConfirmSingle}
                />
                <Button
                  mode="elevated"
                  style={{ marginTop: 10 }}
                  onPress={() => handleBook()}
                >
                  Book Now
                </Button>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default RestaurantDetail;
