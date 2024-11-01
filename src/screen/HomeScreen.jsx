// import {
//   FlatList,
//   Image,
//   ImageBackground,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";
// import React, { useState } from "react";
// import LinearGradient from "react-native-linear-gradient";
// import Header from "../components/Header";
// import Tags from "../components/Tags";
// import ProductCard from "../components/ProductCard";
// import data from "../data/data.json";
// import { useNavigation } from "@react-navigation/native";

// const HomeScreen = () => {
//   const [products, setProducts] = useState(data.products);
//   const navigation = useNavigation();
//   const handleProductDetails = (item) => {
//     navigation.navigate("PRODUCT_DETAILS", { item });
//   };
//   const toggleFavorite = (item) => {
//     setProducts(
//       products.map((prod) => {
//         if (prod.id === item.id) {
//           console.log("prod: ", prod);
//           return {
//             ...prod,
//             isFavorite: !prod.isFavorite,
//           };
//         }
//         return prod;
//       })
//     );
//   };

//   return (
//     <LinearGradient colors={["#FDF0F3", "#FFFBFC"]} style={styles.container}>
//       {/* header */}

//       {/* <Tags /> */}

//       <FlatList
//         ListHeaderComponent={
//           <>
//             <>
//               <Header />
//               <View>
//                 <Text style={styles.headingText}>
//                   Find suitable class & enroll now!
//                 </Text>
//                 <View style={styles.inputContainer}>
//                   <Image
//                     source={require("../assets/search.png")}
//                     style={styles.searchIcon}
//                   />
//                   <TextInput placeholder="Search" style={styles.textInput} />
//                 </View>
//               </View>
//             </>
//             {/* <Tags /> */}
//           </>
//         }
//         data={products}
//         numColumns={2}
//         renderItem={({ item }) => (
//           <ProductCard
//             item={item}
//             handleProductClick={handleProductDetails}
//             toggleFavorite={toggleFavorite}
//           />
//         )}
//         showsVerticalScrollIndicator={false}
//       />
//       <View>
//         {/* <Text>HomeScreen</Text>
//         <Text>HomeScreen</Text> */}
//       </View>
//     </LinearGradient>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     // flex: 1,
//     padding: 20,
//   },

//   headingText: {
//     fontSize: 28,
//     color: "#000000",
//     marginVertical: 20,
//     fontFamily: "Poppins-Regular",
//   },
//   inputContainer: {
//     width: "100%",
//     backgroundColor: "#FFFFFF",
//     height: 48,
//     borderRadius: 12,
//     alignItems: "center",
//     flexDirection: "row",
//   },
//   searchIcon: {
//     height: 26,
//     width: 26,
//     marginHorizontal: 12,
//   },
//   textInput: {
//     fontSize: 18,
//     fontFamily: "Poppins-Regular",
//   },
// });

// import {
//   FlatList,
//   StyleSheet,
//   View,
//   Text,
//   TextInput,
//   Image,
// } from "react-native";
// import React, { useState, useEffect } from "react";
// import LinearGradient from "react-native-linear-gradient";
// import Header from "../components/Header";
// import CourseCard from "../components/CourseCard";
// import database from "@react-native-firebase/database"; // Import Firebase Database
// import { useNavigation } from "@react-navigation/native";

// const HomeScreen = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigation = useNavigation();

//   // Hàm để lấy dữ liệu từ Firebase
//   const fetchCourses = async () => {
//     try {
//       const snapshot = await database().ref("/course").once("value");
//       const data = snapshot.val();

//       // Chuyển đổi dữ liệu từ object thành array
//       const coursesArray = Object.keys(data).map((key) => ({
//         id: key,
//         ...data[key],
//       }));

//       setCourses(coursesArray);
//       setLoading(false); // Dữ liệu đã được tải
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCourses(); // Gọi hàm để lấy dữ liệu khi component render
//   }, []);

//   const handleCourseDetails = (item) => {
//     navigation.navigate("PRODUCT_DETAILS", { item });
//   };

//   if (loading) {
//     return <Text>Loading...</Text>;
//   }

//   return (
//     <LinearGradient colors={["#FDF0F3", "#FFFBFC"]} style={styles.container}>
//       <FlatList
//         ListHeaderComponent={
//           <>
//             <Header />
//             <View>
//               <Text style={styles.headingText}>
//                 Find suitable class & enroll now!
//               </Text>
//               <View style={styles.inputContainer}>
//                 <Image
//                   source={require("../assets/search.png")}
//                   style={styles.searchIcon}
//                 />
//                 <TextInput placeholder="Search" style={styles.textInput} />
//               </View>
//             </View>
//           </>
//         }
//         data={courses} // Dữ liệu từ Firebase
//         numColumns={2}
//         renderItem={({ item }) => (
//           <CourseCard
//             item={item} // Dữ liệu từng khóa học
//             handleProductClick={handleCourseDetails} // Điều hướng đến chi tiết khóa học
//           />
//         )}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//       />
//     </LinearGradient>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   headingText: {
//     fontSize: 28,
//     color: "#000000",
//     marginVertical: 20,
//     fontFamily: "Poppins-Regular",
//   },
//   inputContainer: {
//     width: "100%",
//     backgroundColor: "#FFFFFF",
//     height: 48,
//     borderRadius: 12,
//     alignItems: "center",
//     flexDirection: "row",
//   },
//   searchIcon: {
//     height: 26,
//     width: 26,
//     marginHorizontal: 12,
//   },
//   textInput: {
//     fontSize: 18,
//     fontFamily: "Poppins-Regular",
//   },
// });

import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import LinearGradient from "react-native-linear-gradient";
import Header from "../components/Header";
import CourseCard from "../components/CourseCard";
import database from "@react-native-firebase/database"; // Import Firebase Database
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Hàm để lấy thông tin người đăng dựa trên postedBy
  const fetchPostedByInfo = async (postedBy) => {
    try {
      const snapshot = await database()
        .ref(`/user_details/${postedBy}`)
        .once("value");
      return snapshot.val(); // Trả về thông tin người dùng
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  };

  // Hàm để lấy dữ liệu từ Firebase
  const fetchCourses = async () => {
    try {
      const snapshot = await database().ref("/course").once("value");
      const data = snapshot.val();

      const coursesArray = await Promise.all(
        Object.keys(data).map(async (key) => {
          const course = data[key];
          const postedByInfo = await fetchPostedByInfo(course.postedBy); // Lấy thông tin người đăng
          return {
            id: key,
            ...course,
            postedByName: postedByInfo?.name || "Unknown",
            profile: postedByInfo?.profile || null,
          };
        })
      );

      setCourses(coursesArray);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCourseDetails = (item) => {
    navigation.navigate("COURSE_DETAILS", { item });
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <LinearGradient colors={["#FDF0F3", "#FFFBFC"]} style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Header />
            <View>
              <Text style={styles.headingText}>
                Find suitable class & enroll now!
              </Text>
              <View style={styles.inputContainer}>
                <Image
                  source={require("../assets/search.png")}
                  style={styles.searchIcon}
                />
                <TextInput placeholder="Search" style={styles.textInput} />
              </View>
            </View>
          </>
        }
        data={courses} // Dữ liệu từ Firebase với thông tin người đăng
        numColumns={2}
        renderItem={({ item }) => (
          <CourseCard
            item={item} // Dữ liệu từng khóa học
            handleProductClick={handleCourseDetails} // Điều hướng đến chi tiết khóa học
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headingText: {
    fontSize: 28,
    color: "#000000",
    marginVertical: 20,
    fontFamily: "Poppins-Regular",
  },
  inputContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
  },
  searchIcon: {
    height: 26,
    width: 26,
    marginHorizontal: 12,
  },
  textInput: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
  },
});
