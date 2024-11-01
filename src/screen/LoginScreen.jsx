// import React, { useState } from "react";
// import { View, TextInput, Button, Text } from "react-native";
// import auth from "@react-native-firebase/auth";

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleLogin = async () => {
//     try {
//       await auth().signInWithEmailAndPassword(email, password);
//       alert("Đăng nhập thành công!");
//       navigation.navigate("HOME"); // Chuyển hướng tới trang Home sau khi đăng nhập
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   return (
//     <View>
//       <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
//       <TextInput
//         placeholder="Mật khẩu"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <Button title="Đăng nhập" onPress={handleLogin} />
//       {error ? <Text>{error}</Text> : null}
//       <Button
//         title="Chưa có tài khoản? Đăng ký"
//         onPress={() => navigation.navigate("Register")}
//       />
//     </View>
//   );
// };

// export default LoginScreen;

import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import auth from "@react-native-firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Trạng thái loading khi đang xử lý đăng nhập

  const handleLogin = async () => {
    setLoading(true); // Hiển thị ActivityIndicator khi bắt đầu đăng nhập
    setError(""); // Xóa lỗi cũ trước khi xử lý đăng nhập

    try {
      await auth().signInWithEmailAndPassword(email, password);
      alert("Log In successfully!");
      setLoading(false);
      navigation.navigate("HOME"); // Chuyển hướng tới trang Home sau khi đăng nhập
    } catch (error) {
      setLoading(false);
      handleAuthError(error); // Gọi hàm xử lý lỗi chi tiết
    }
  };

  // Xử lý lỗi đăng nhập từ Firebase
  const handleAuthError = (error) => {
    switch (error.code) {
      case "auth/invalid-email":
        setError("Invalid email.");
        break;
      case "auth/user-not-found":
        setError("User not found.");
        break;
      case "auth/wrong-password":
        setError("Incorrect password.");
        break;
      default:
        setError("Something wrong, please try again!!!.");
        break;
    }
  };

  // return (
  //   <View style={{ padding: 20 }}>
  //     <TextInput
  //       placeholder="Email"
  //       value={email}
  //       onChangeText={setEmail}
  //       autoCapitalize="none" // Tắt chức năng tự động viết hoa
  //       keyboardType="email-address" // Bàn phím chỉ nhập email
  //       style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
  //     />
  //     <TextInput
  //       placeholder="Mật khẩu"
  //       value={password}
  //       onChangeText={setPassword}
  //       secureTextEntry
  //       style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
  //     />
  //     {loading ? (
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     ) : (
  //       <Button title="Đăng nhập" onPress={handleLogin} />
  //     )}
  //     {error ? (
  //       <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>
  //     ) : null}
  //     <Button
  //       title="Chưa có tài khoản? Đăng ký"
  //       onPress={() => navigation.navigate("Register")}
  //       style={{ marginTop: 10 }}
  //     />
  //   </View>
  // );
  return (
    <View style={styles.container}>
      {/* Already have an account section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Already{"\n"}have an{"\n"}Account?
        </Text>
        <Image
          source={require("../assets/yoga_auth.png")}
          style={styles.image}
        />
      </View>

      {/* Email and Password inputs */}
      <View style={styles.inputContainer}>
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
        <View style={styles.containerForgot}>
          <TouchableOpacity onPress={() => alert("Forgot Password pressed")}>
            <Text style={styles.forgotPassword}>Forgot Password</Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>
        ) : null}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="SIGN IN" onPress={handleLogin} />
        )}
      </View>

      {/* Sign Up section */}
      <View style={styles.footer}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.signUp}>Sign Up</Text>
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
    marginLeft: 100,
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

export default LoginScreen;
