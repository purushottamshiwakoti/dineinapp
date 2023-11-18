import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Appbar } from "react-native-paper";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import useAUthStore from "../hooks/authStore";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = useState(false);
  const { setUserFirstName, setUserLastName, setUserEmail, setId } =
    useAUthStore();

  const handleLogin = async () => {
    try {
      console.log(email, password);
      setError(false);
      const response = await axios.post(
        "https://dinein-phi.vercel.app/api/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log({ response });
      if (response.status === 200) {
        console.log(response.data);
        const { findUser } = response.data;
        console.log(findUser);
        setUserFirstName(findUser.firstName);
        setUserLastName(findUser.lastName);
        setUserEmail(findUser.email);
        setId(findUser.id);
        alert("Successfully logged in");
        navigation.navigate("Home");
        setError(false);
      } else {
        setError(true);
        setPassword("");
      }
      console.log(findUser);
    } catch (error) {
      setError(true);
      setPassword("");

      console.log(error.message);
    }
  };

  return (
    <ScrollView>
      <Appbar.Header>
        <Appbar.Content title="Login" />
      </Appbar.Header>
      <View style={{ marginTop: 20 }}>
        <Image
          source={require("../../assets/dinein.png")}
          style={{
            display: "flex",
            borderRadius: 200,
            marginLeft: 70,
          }}
        />
        <Text style={{ fontSize: 18, textAlign: "center" }}>
          Login To Your Account
        </Text>
        {error && (
          <Text style={{ color: "red", fontSize: 15 }}>
            Invalid Crediantials
          </Text>
        )}
        <View style={{ margin: 10 }}>
          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={{ marginTop: 10 }}
          />
          <Button
            mode="outlined"
            style={{ marginTop: 15 }}
            onPress={() => handleLogin()}
          >
            Login
          </Button>
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text>Don't have an Account?</Text>
                <Text
                  style={{ fontWeight: "bold", marginLeft: 2 }}
                  onPress={() => navigation.navigate("Register")}
                >
                  Register Here
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Login;
