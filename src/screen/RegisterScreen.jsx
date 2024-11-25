import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database"; // Import Realtime Database
// Segment 
const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Trạng thái loading khi đang xử lý đăng nhập
  const [confirmPassword, setConfirmPassword] = useState(""); // Trạng thái loading khi đang xử lý đăng nhập

  const handleRegister = async () => {
    setLoading(true); // Hiển thị ActivityIndicator khi bắt đầu đăng nhập

    try {
      if (password === confirmPassword) {
        // Tạo người dùng bằng email và mật khẩu
        const userCredential = await auth().createUserWithEmailAndPassword(
          email,
          password
        );
        const user = userCredential.user;

        // Kiểm tra xem người dùng có tồn tại không trước khi lưu
        if (user) {
          // Lưu thông tin người dùng vào Realtime Database
          await database().ref(`/user_details/${user.uid}`).set({
            userId: user.uid,
            name: name,
            email: email,
            password: password,
            profile:
              "https://firebasestorage.googleapis.com/v0/b/yoga-f7065.appspot.com/o/profile_image%2Fuser_profile.jpg?alt=media&token=69413328-0e26-4fad-9900-a2112903c08e", // URL hoặc chuỗi base64 của ảnh đại diện
            role: "user",
          });
          setLoading(false);

          await auth().signOut();

          alert("Sign Up successfully!");
          navigation.navigate("Login"); // Điều hướng về trang đăng nhập sau khi đăng ký thành công
        }
      } else {
        setError("Passwords do not match!");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      handleAuthError(error); // Gọi hàm xử lý lỗi chi tiết
    }
  };
  // Improved error handling function
  const handleAuthError = (error) => {
    switch (error.code) {
      case "auth/invalid-email":
        setError("Invalid email format.");
        break;
      case "auth/email-already-in-use":
        setError(
          "This email is already in use. Try logging in or using another email."
        );
        break;
      case "auth/weak-password":
        setError("Password should be at least 6 characters.");
        break;
      case "auth/operation-not-allowed":
        setError(
          "Registration is not allowed at the moment. Please try again later."
        );
        break;
      case "auth/user-disabled":
        setError("This user account has been disabled.");
        break;
      case "auth/network-request-failed":
        setError(
          "Network error. Please check your internet connection and try again."
        );
        break;
      default:
        setError("An unknown error occurred. Please try again.");
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Already have an account section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Here's{"\n"}your first{"\n"}step with us!
        </Text>
        <Image
          source={require("../assets/yoga_auth.png")}
          style={styles.image}
        />
      </View>

      {/* Email and Password inputs */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Type your full name"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={styles.label}>Confirm Password</Text>

        <TextInput
          style={styles.input}
          placeholder="********"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {error ? (
          <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>
        ) : null}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="SIGN UP" onPress={handleRegister} />
        )}
      </View>

      {/* Sign Up section */}
      <View style={styles.footer}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.signUp}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginLeft: 40,
  },
  inputContainer: {
    marginTop: 32,
  },
  label: {
    color: "#000", // replace with your color code if needed
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000", // replace with your color code if needed
    padding: 8,
    borderRadius: 5,
    marginBottom: 16,
  },
  containerForgot: { marginTop: 5, marginBottom: 50 },
  forgotPassword: {
    color: "#000", // replace with your color code if needed
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "right",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  signUp: {
    color: "#000", // replace with your color code if needed
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default RegisterScreen;
