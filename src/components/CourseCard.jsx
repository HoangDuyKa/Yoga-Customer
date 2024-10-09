import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

// const CourseCard = () => {
//   return (
//     <View style={styles.cardView}>
//       <View style={styles.container}>
//         {/* Image for the course */}
//         <Image
//           source={require("./../assets/placeholder.png")} // Replace with actual image path
//           style={styles.courseImage}
//           resizeMode="cover"
//         />

//         {/* Course Title */}
//         <Text style={styles.courseTitle}>Course Title</Text>

//         {/* Posted By and Price Section */}
//         <View style={styles.row}>
//           {/* Profile Image */}
//           <Image
//             source={require("./../assets/yoga_logo.png")} // Replace with actual image path
//             style={styles.profileImage}
//             resizeMode="cover"
//           />

//           {/* Posted By Name */}
//           <Text style={styles.postedByName}>Posted By Name</Text>

//           {/* Course Price */}
//           <Text style={styles.coursePrice}>$50</Text>
//         </View>
//       </View>
//     </View>
//   );
// };
const CourseCard = ({ item, handleProductClick }) => {
  if (!item) {
    // Kiểm tra nếu item không tồn tại
    return null; // Không render gì cả nếu không có item
  }
  return (
    <TouchableOpacity onPress={() => handleProductClick(item)}>
      <View style={styles.cardView}>
        <Image
          source={{ uri: item.thumbnail }} // Hiển thị thumbnail của khóa học
          style={styles.courseImage}
          resizeMode="cover"
        />
        <Text style={styles.courseTitle}>{item.title}</Text>
        <View style={styles.row}>
          <Image
            source={{ uri: item.profile }} // Hiển thị ảnh người đăng
            style={styles.profileImage}
            resizeMode="cover"
          />
          <Text style={styles.postedByName}>{item.postedByName}</Text>
          <Text style={styles.coursePrice}>${item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardView: {
    margin: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  container: {
    margin: 5,
    padding: 5,
  },
  courseImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  courseTitle: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 20,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  postedByName: {
    marginLeft: 8,
    marginRight: 8,
  },
  coursePrice: {
    marginLeft: "auto",
    color: "#000", // Use appropriate color here
    fontWeight: "bold",
  },
});

export default CourseCard;
