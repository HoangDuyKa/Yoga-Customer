import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Card } from "react-native-paper"; // Card component for CardView equivalent

import { launchImageLibrary } from "react-native-image-picker";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import storage from "@react-native-firebase/storage";
import { UserContext } from "../context/UserContext";
const AccountScreen = ({ navigation }) => {
  const handleLogout = () => {
    auth()
      .signOut()
      .catch((error) => {
        console.error(error);
      });
  };

  const { userImage, setUserImage } = useContext(UserContext);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const user = auth().currentUser;
    if (user) {
      const userId = user.uid;
      const snapshot = await database()
        .ref(`/user_details/${userId}`)
        .once("value");
      const data = snapshot.val();
      if (data) {
        setUserData({
          name: data.name || "Anonymous",
          email: data.email || "",
        });
      }
    }
  };

  const handleImagePick = async () => {
    await launchImageLibrary({ mediaType: "photo" }, async (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorMessage) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else {
        const imageUri = response.assets[0].uri;
        await uploadImage(imageUri);
      }
    });
  };

  const uploadImage = async (imageUri) => {
    const userId = auth().currentUser.uid;
    const reference = storage().ref(`/profile_image/${userId}.jpg`);

    try {
      await reference.putFile(imageUri);
      const url = await reference.getDownloadURL();

      await database().ref(`/user_details/${userId}`).update({ profile: url });
      setUserImage(url); // Cập nhật ảnh đại diện trong context
      Alert.alert("Success", "Profile image updated successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image");
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePick}>
        <Image source={{ uri: userImage }} style={styles.profileImage} />
      </TouchableOpacity>

      <Text style={styles.userName}>{userData.name}</Text>
      <Text style={styles.userEmail}>{userData.email}</Text>

      <Card style={styles.card}>
        <TouchableOpacity style={styles.cardContent}>
          <Image
            source={require("../assets/terms_service.png")}
            style={styles.icon}
          />
          <Text style={styles.cardText}>Terms and Conditions</Text>
        </TouchableOpacity>
      </Card>

      <Card style={styles.card}>
        <TouchableOpacity style={styles.cardContent}>
          <Image source={require("../assets/rate.png")} style={styles.icon} />
          <Text style={styles.cardText}>Rate us on play store</Text>
        </TouchableOpacity>
      </Card>

      <Card style={styles.card}>
        <TouchableOpacity style={styles.cardContent}>
          <Image source={require("../assets/share.png")} style={styles.icon} />
          <Text style={styles.cardText}>Share</Text>
        </TouchableOpacity>
      </Card>

      <Card style={styles.card}>
        <TouchableOpacity style={styles.cardContent} onPress={handleLogout}>
          <Image source={require("../assets/logout.png")} style={styles.icon} />
          <Text style={styles.cardText}>Logout</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48, // Half of the width/height to make it circular
    borderColor: "#000000",
    borderWidth: 2,
    marginTop: 20,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
  },
  userEmail: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginTop: 5,
  },
  card: {
    width: "90%",
    marginVertical: 12,
    borderRadius: 5,
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 15,
  },
  cardText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
});
