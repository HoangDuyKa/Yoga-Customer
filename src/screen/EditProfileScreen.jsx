import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";

const EditProfileScreen = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateProfile = async () => {
    setLoading(true);
    const user = auth().currentUser;
    let success = true;

    // Update name if provided
    if (name && user) {
      try {
        await database().ref(`/user_details/${user.uid}`).update({ name });
      } catch (error) {
        Alert.alert("Error", "Failed to update name");
        console.error(error);
        success = false; // Mark failure
      }
    }

    // Update password if provided and confirmed
    if (password && currentPassword && user) {
      if (password !== confirmPassword) {
        Alert.alert("Error", "New passwords do not match");
        success = false;
      } else {
        try {
          const credential = auth.EmailAuthProvider.credential(
            user.email,
            currentPassword
          );
          await user.reauthenticateWithCredential(credential);
          await user.updatePassword(password);
        } catch (error) {
          Alert.alert("Error", "Failed to update password");
          console.error(error);
          success = false;
        }
      }
    }

    setLoading(false);

    // Navigate back only if all updates were successful
    if (success) {
      Alert.alert("Success", "Update user successfully");
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Current Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter current password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm new password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button
        title={loading ? "Updating..." : "Save Changes"}
        onPress={updateProfile}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
});

export default EditProfileScreen;
