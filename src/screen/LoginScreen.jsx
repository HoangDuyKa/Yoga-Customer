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
import { View, TextInput, Button, Text, ActivityIndicator } from "react-native";
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
      alert("Đăng nhập thành công!");
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
        setError("Địa chỉ email không hợp lệ.");
        break;
      case "auth/user-not-found":
        setError("Không tìm thấy tài khoản người dùng.");
        break;
      case "auth/wrong-password":
        setError("Mật khẩu không chính xác.");
        break;
      default:
        setError("Đã xảy ra lỗi, vui lòng thử lại.");
        break;
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none" // Tắt chức năng tự động viết hoa
        keyboardType="email-address" // Bàn phím chỉ nhập email
        style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
      />
      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Đăng nhập" onPress={handleLogin} />
      )}
      {error ? (
        <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>
      ) : null}
      <Button
        title="Chưa có tài khoản? Đăng ký"
        onPress={() => navigation.navigate("Register")}
        style={{ marginTop: 10 }}
      />
    </View>
  );
};

export default LoginScreen;
