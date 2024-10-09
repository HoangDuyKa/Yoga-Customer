import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database"; // Import Realtime Database

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Trạng thái loading khi đang xử lý đăng nhập

  const handleRegister = async () => {
    setLoading(true); // Hiển thị ActivityIndicator khi bắt đầu đăng nhập

    try {
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
          name: name,
          email: email,
          password: password,
          profile: "no_profile_img", // URL hoặc chuỗi base64 của ảnh đại diện
        });
        setLoading(false);

        await auth().signOut();

        alert("Đăng ký thành công!");
        navigation.navigate("Login"); // Điều hướng về trang đăng nhập sau khi đăng ký thành công
      }
    } catch (error) {
      setError(error.message); // Hiển thị lỗi nếu có vấn đề xảy ra
      console.error("Error registering user:", error);
    }
  };

  return (
    <View>
      <TextInput placeholder="Tên" value={name} onChangeText={setName} />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Đăng ký" onPress={handleRegister} />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
    </View>
  );
};

export default RegisterScreen;
