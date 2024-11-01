import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import { fonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";

const Header = ({ isCart }) => {
  const navigation = useNavigation();
  const { userImage } = useContext(UserContext);
  const handleBack = () => {
    navigation.navigate("HOME");
  };

  return (
    <View style={styles.header}>
      {isCart ? (
        <TouchableOpacity
          style={styles.appDrawerContainer}
          onPress={handleBack}
        >
          <Image
            source={require("../assets/arrowback.png")}
            style={styles.appBackIcon}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.appDrawerContainer}>
          <Image
            source={require("../assets/apps.png")}
            style={styles.appDrawerIcon}
          />
        </View>
      )}

      {isCart ? <Text style={styles.titleText}>My Cart</Text> : null}
      <View style={styles.appDrawerContainer}>
        <Image
          source={{ uri: userImage }}
          // source={require("../assets/Ellipse2.png")}
          style={styles.profileImage}
        />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  appDrawerContainer: {
    backgroundColor: "white",
    height: 44,
    width: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  appDrawerIcon: {
    height: 30,
    width: 30,
  },
  appBackIcon: {
    height: 24,
    width: 24,
    marginLeft: 10,
  },
  profileImage: {
    height: 44,
    width: 44,
    borderRadius: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: 28,
    fontFamily: fonts.regular,
    color: "#000000",
  },
});
