import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { fonts } from "../utils/fonts";
import moment from "moment"; // Import moment.js for date formatting
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import { useNavigation } from "@react-navigation/native";
const CartCard = ({ item }) => {
  const navigation = useNavigation();

  const handleUnenroll = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const userId = user.uid;

        // Query the Booking table for entries with matching userId and courseId
        const bookingSnapshot = await database()
          .ref(`/Booking`)
          .orderByChild("userId") // Start by filtering by userId
          .equalTo(userId) // Match the current user's userId
          .once("value");

        const bookingData = bookingSnapshot.val();
        if (bookingData) {
          // Look for the specific courseId in the filtered bookings
          const bookingKey = Object.keys(bookingData).find(
            (key) => bookingData[key].courseId === item.postId
          );

          if (bookingKey) {
            // Remove the booking entry from the database
            await database().ref(`/Booking/${bookingKey}`).remove();

            navigation.navigate("HOME");

            Alert.alert(
              "Unenrollment Successful",
              "You have been unenrolled from the course."
            );
          } else {
            Alert.alert("Error", "No matching booking found for this course.");
          }
        } else {
          Alert.alert("Error", "No bookings found for this user.");
        }
      } else {
        Alert.alert("Error", "Please log in to unenroll from this course.");
      }
    } catch (error) {
      console.error("Unenrollment Error:", error);
      Alert.alert(
        "Unenrollment Failed",
        "An error occurred. Please try again."
      );
    }
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.enrollDate}>
          Enrolled on: {moment(item.enrolledAt).format("MMMM D, YYYY")}
        </Text>
      </View>

      <TouchableOpacity onPress={handleUnenroll} style={styles.deleteContainer}>
        <Image
          source={require("../assets/deleteIcon.png")}
          style={styles.deleteIcon}
        />
      </TouchableOpacity>

      <Text style={styles.price}>${item.price}</Text>
    </View>
  );
};

export default CartCard;
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginVertical: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: "relative", // Allow absolute positioning for children
  },
  image: {
    height: 100,
    width: 100,
    resizeMode: "cover",
    borderRadius: 10,
  },
  content: {
    flex: 1,
    paddingLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#444444",
  },
  enrollDate: {
    fontSize: 14,
    color: "#757575",
    marginTop: 8,
  },
  price: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "#444444",
  },
  deleteContainer: {
    marginLeft: 10,
  },
  deleteIcon: {
    height: 25,
    width: 25,
    alignSelf: "center",
  },
});
