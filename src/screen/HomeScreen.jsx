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
//   const [filteredCourses, setFilteredCourses] = useState([]);
//   const [searchQuery, setSearchQuery] = useState(""); // New state for search input
//   const navigation = useNavigation();

//   // Hàm để lấy thông tin người đăng dựa trên postedBy
//   const fetchPostedByInfo = async (postedBy) => {
//     try {
//       const snapshot = await database()
//         .ref(`/user_details/${postedBy}`)
//         .once("value");
//       return snapshot.val(); // Trả về thông tin người dùng
//     } catch (error) {
//       console.error("Error fetching user info:", error);
//       return null;
//     }
//   };

//   // Hàm để lấy dữ liệu từ Firebase
//   const fetchCourses = async () => {
//     try {
//       const snapshot = await database().ref("/course").once("value");
//       const data = snapshot.val();

//       const coursesArray = await Promise.all(
//         Object.keys(data).map(async (key) => {
//           const course = data[key];
//           const postedByInfo = await fetchPostedByInfo(course.postedBy); // Lấy thông tin người đăng
//           return {
//             id: key,
//             ...course,
//             postedByName: postedByInfo?.name || "Unknown",
//             profile: postedByInfo?.profile || null,
//           };
//         })
//       );

//       setCourses(coursesArray);
//       setFilteredCourses(coursesArray); // Initialize filteredCourses with all courses
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   // Filter courses based on search query
//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     if (query.trim() === "") {
//       setFilteredCourses(courses); // Show all courses if search is empty
//     } else {
//       const filteredData = courses.filter((course) =>
//         course.postedByName.toLowerCase().includes(query.toLowerCase())
//       );
//       setFilteredCourses(filteredData);
//     }
//   };

//   const handleCourseDetails = (item) => {
//     navigation.navigate("COURSE_DETAILS", { item });
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
//                 {/* <TextInput placeholder="Search" style={styles.textInput} /> */}
//                 <TextInput
//                   placeholder="Search by author name"
//                   style={styles.textInput}
//                   value={searchQuery}
//                   onChangeText={handleSearch} // Update search query
//                 />
//               </View>
//             </View>
//           </>
//         }
//         data={courses} // Dữ liệu từ Firebase với thông tin người đăng
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
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search input
  const navigation = useNavigation();

  // Fetch user info based on postedBy ID
  const fetchPostedByInfo = async (postedBy) => {
    try {
      const snapshot = await database()
        .ref(`/user_details/${postedBy}`)
        .once("value");
      return snapshot.val(); // Return user info
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  };

  // Fetch courses from Firebase
  const fetchCourses = async () => {
    try {
      const snapshot = await database().ref("/course").once("value");
      const data = snapshot.val();

      const coursesArray = await Promise.all(
        Object.keys(data).map(async (key) => {
          const course = data[key];
          const postedByInfo = await fetchPostedByInfo(course.postedBy); // Get postedBy info
          return {
            id: key,
            ...course,
            postedByName: postedByInfo?.name || "Unknown",
            profile: postedByInfo?.profile || null,
          };
        })
      );

      setCourses(coursesArray);
      setFilteredCourses(coursesArray); // Initialize filteredCourses with all courses
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter courses based on search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredCourses(courses); // Show all courses if search is empty
    } else {
      const filteredData = courses.filter((course) =>
        course.postedByName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCourses(filteredData);
    }
  };

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
                <TextInput
                  placeholder="Search by author name"
                  style={styles.textInput}
                  value={searchQuery}
                  onChangeText={handleSearch} // Update search query
                />
              </View>
            </View>
          </>
        }
        data={filteredCourses} // Use filteredCourses for display
        numColumns={2}
        renderItem={({ item }) => (
          <CourseCard
            item={item} // Course data
            handleProductClick={handleCourseDetails} // Navigate to course details
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
    flex: 1,
  },
});
