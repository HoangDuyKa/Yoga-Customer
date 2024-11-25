import { View, Text, Image, ActivityIndicator } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./src/screen/HomeScreen";
import CartScreen from "./src/screen/CartScreen";
import ReorderScreen from "./src/screen/ReorderScreen";
import AccountScreen from "./src/screen/ProfileScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CartContext, CartProvider } from "./src/context/CartContext";
import LoginScreen from "./src/screen/LoginScreen"; // Thêm màn hình đăng nhập
import auth from "@react-native-firebase/auth"; // Firebase auth
import RegisterScreen from "./src/screen/RegisterScreen";
import CoursesDetailsScreen from "./src/screen/CoursesDetailsScreen";
import { UserProvider } from "./src/context/UserContext";
import EditProfileScreen from "./src/screen/EditProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MyHomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HOME" component={HomeScreen} />
      <Stack.Screen name="COURSE_DETAILS" component={CoursesDetailsScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Lắng nghe sự thay đổi trạng thái người dùng
  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Hủy lắng nghe khi component unmount
  }, []);

  if (initializing) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Hiển thị khi Firebase đang khởi tạo
  }

  return (
    <NavigationContainer>
      <UserProvider>
        <CartProvider>
          {user ? ( // Nếu đã đăng nhập thì hiển thị Tab Navigator
            <Tab.Navigator
              screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
              }}
            >
              <Tab.Screen
                name="HOME_STACK"
                component={MyHomeStack}
                options={{
                  tabBarIcon: ({ focused, size }) => {
                    return (
                      <Image
                        source={
                          focused
                            ? require("./src/assets/focused/home.png")
                            : require("./src/assets/normal/home.png")
                        }
                        style={{
                          height: size,
                          width: size,
                          resizeMode: "center",
                        }}
                      />
                    );
                  },
                }}
              />
              <Tab.Screen
                name="REORDER"
                component={ReorderScreen}
                options={{
                  tabBarIcon: ({ focused, size }) => {
                    return (
                      <Image
                        source={
                          focused
                            ? require("./src/assets/focused/reorder.png")
                            : require("./src/assets/normal/reorder.png")
                        }
                        style={{
                          height: size,
                          width: size,
                          resizeMode: "center",
                        }}
                      />
                    );
                  },
                }}
              />
              <Tab.Screen
                name="CART"
                component={CartScreen}
                options={{
                  tabBarIcon: ({ focused, size }) => {
                    const { countCart } = useContext(CartContext);
                    return (
                      <View style={{ position: "relative" }}>
                        <Image
                          source={
                            focused
                              ? require("./src/assets/focused/shopping_cart.png")
                              : require("./src/assets/normal/shopping_cart.png")
                          }
                          style={{
                            height: size,
                            width: size,
                            resizeMode: "center",
                          }}
                        />
                        <View
                          style={{
                            position: "absolute",
                            right: -3,
                            bottom: 22,
                            height: 14,
                            width: 14,
                            backgroundColor: focused ? "#E96E6E" : "#C0C0C0",
                            borderRadius: 7,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text style={{ color: "white", fontSize: 10 }}>
                            {countCart}
                          </Text>
                        </View>
                      </View>
                    );
                  },
                }}
              />
              <Tab.Screen
                name="ACCOUNT"
                component={AccountScreen}
                options={{
                  tabBarIcon: ({ focused, size }) => {
                    return (
                      <Image
                        source={
                          focused
                            ? require("./src/assets/focused/account.png")
                            : require("./src/assets/normal/account.png")
                        }
                        style={{
                          height: size,
                          width: size,
                          resizeMode: "center",
                        }}
                      />
                    );
                  },
                }}
              />
            </Tab.Navigator>
          ) : (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="HOME" component={HomeScreen} />
            </Stack.Navigator>
          )}
        </CartProvider>
      </UserProvider>
    </NavigationContainer>
  );
};

export default App;
