// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const AccountScreen = () => {
//   return (
//     <View>
//       <Text>coming soon</Text>
//     </View>
//   )
// }

// export default AccountScreen

// const styles = StyleSheet.create({})

import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import auth from "@react-native-firebase/auth";
import CourseCard from "../components/CourseCard";

const AccountScreen = ({ navigation }) => {
  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        // Sau khi đăng xuất, điều hướng người dùng về màn hình Login
        // navigation.replace("Login"); // Thay thế màn hình hiện tại bằng màn hình đăng nhập
        navigation.navigate("Login"); // Thay thế màn hình hiện tại bằng màn hình đăng nhập
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text>coming soon</Text>
      <Button title="Đăng xuất" onPress={handleLogout} />
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
