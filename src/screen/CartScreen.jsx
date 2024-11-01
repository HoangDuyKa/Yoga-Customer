import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import LinearGradient from "react-native-linear-gradient";
import Header from "../components/Header";
import CartCard from "../components/CartCard";
import { fonts } from "../utils/fonts";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import { useFocusEffect } from "@react-navigation/native";

const CartScreen = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0); // State for total price
  const fetchEnrolledCourses = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const userId = user.uid;

        // Fetch enrolled courses from user_details
        const snapshot = await database()
          .ref(`/user_details/${userId}/enrolled_courses`)
          .once("value");

        const courses = snapshot.val();
        if (courses) {
          // Convert object to array for FlatList
          const coursesArray = Object.keys(courses).map((key) => ({
            id: key,
            ...courses[key],
          }));
          setEnrolledCourses(coursesArray);
        } else {
          setEnrolledCourses([]);
        }
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchEnrolledCourses();
  // }, []);

  // Calculate total price whenever enrolledCourses changes
  useEffect(() => {
    const total = enrolledCourses.reduce((sum, course) => {
      // Ensure course.price is a number
      return sum + (parseFloat(course.price) || 0);
    }, 0);
    setTotalPrice(total);
  }, [enrolledCourses]);

  useFocusEffect(
    React.useCallback(() => {
      console.log("Cart screen focused");
      fetchEnrolledCourses();
    }, [])
  );
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <LinearGradient colors={["#FDF0F3", "#FFFBFC"]} style={styles.container}>
      <View style={styles.header}>
        <Header isCart={true} />
      </View>

      {enrolledCourses.length > 0 ? (
        <FlatList
          data={enrolledCourses}
          renderItem={({ item }) => <CartCard item={item} />}
          keyExtractor={(item) => item.id} // Use unique key for each item
          contentContainerStyle={{ marginTop: 40, paddingBottom: 200 }}
          ListFooterComponent={
            <>
              <View style={styles.bottomContentContainer}>
                <View style={styles.flexRowContainer}>
                  <Text style={styles.titleText}>Total Enrollments:</Text>
                  <Text style={styles.lengthText}>
                    {enrolledCourses.length}
                  </Text>
                </View>
                <View style={styles.flexRowContainer}>
                  <Text style={styles.titleText}>Total Prices:</Text>
                  <Text style={styles.priceText}>${totalPrice}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Checkout</Text>
              </TouchableOpacity>
            </>
          }
        />
      ) : (
        <Text style={styles.noCoursesText}>No enrolled courses found.</Text>
      )}
    </LinearGradient>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  header: {},
  flexRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  bottomContentContainer: {
    marginHorizontal: 10,
    marginTop: 30,
  },
  titleText: {
    fontSize: 18,
    color: "#757575",
    fontWeight: "500",
  },
  lengthText: { fontSize: 18, color: "#757575", fontWeight: "600" },
  priceText: {
    fontSize: 18,
    color: "#757575",
    fontWeight: "600",
  },
  noCoursesText: {
    fontSize: 18,
    color: "#757575",
    fontWeight: "500",
    textAlign: "center",
    marginTop: 20,
  },
  divider: {
    borderWidth: 1,
    borderColor: "#C0C0C0",
    marginTop: 10,
    marginBottom: 5,
  },
  grandPriceText: {
    color: "#3C3C3C",
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#E96E6E",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginTop: 30,
  },
  buttonText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "700",
    fontFamily: fonts.regular,
  },
});
