// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   Button,
//   FlatList,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";
// import Video from "react-native-video"; // Thư viện video cho React Native
// import { useRoute } from "@react-navigation/native"; // Lấy dữ liệu từ navigation

// const CourseDetailsScreen = () => {
//   const route = useRoute();
//   const { item } = route.params; // Dữ liệu item từ Firebase, truyền từ HomeScreen

//   const [descriptionVisible, setDescriptionVisible] = useState(false);

//   // Hàm chuyển đổi hiển thị mô tả
//   const toggleDescription = () => {
//     setDescriptionVisible(!descriptionVisible);
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {/* Phần video */}
//       <Video
//         source={{ uri: item.introVideo }}
//         style={styles.videoPlayer}
//         controls={true}
//         resizeMode="cover"
//       />

//       {/* Thông tin khóa học */}
//       <View style={styles.infoContainer}>
//         <Text style={styles.courseTitle}>{item.title}</Text>
//         <Text style={styles.createdBy}>Created by {item.postedByName}</Text>

//         {/* Rating và Duration */}
//         <View style={styles.row}>
//           <Image
//             source={require("./../assets/star.png")}
//             style={styles.iconSmall}
//           />
//           <Text style={styles.rating}>{item.rating}</Text>

//           <Image
//             source={require("./../assets/clock.png")}
//             style={[styles.iconSmall, { marginLeft: 10 }]}
//           />
//           <Text style={styles.duration}>{item.duration} minutes</Text>

//           <Text style={styles.price}>${item.price}</Text>
//         </View>
//       </View>

//       {/* Mô tả và Playlist */}
//       <View style={styles.card}>
//         <View style={styles.row}>
//           <TouchableOpacity onPress={toggleDescription}>
//             <Text style={styles.btnText}>Description</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Hiển thị Mô tả */}
//       {descriptionVisible && (
//         <Text style={styles.description}>{item.description}</Text>
//       )}

//       {/* Nút Enroll */}
//       <View style={styles.enrollContainer}>
//         <Button title="Enroll Now" onPress={() => alert("Enrolled")} />
//       </View>
//     </ScrollView>
//   );
// };

// export default CourseDetailsScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   videoPlayer: {
//     width: "100%",
//     height: 200,
//     backgroundColor: "black",
//   },
//   infoContainer: {
//     marginTop: 20,
//   },
//   courseTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   createdBy: {
//     marginTop: 5,
//     fontSize: 16,
//     color: "#666",
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 10,
//   },
//   iconSmall: {
//     width: 15,
//     height: 15,
//   },
//   rating: {
//     marginLeft: 5,
//     fontSize: 16,
//   },
//   duration: {
//     marginLeft: 10,
//     fontSize: 16,
//   },
//   price: {
//     marginLeft: "auto",
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   card: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: "#fff",
//     borderRadius: 5,
//     elevation: 3,
//   },
//   btnText: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   description: {
//     marginTop: 10,
//     fontSize: 14,
//     color: "#333",
//   },
//   enrollContainer: {
//     marginTop: 30,
//     alignItems: "center",
//   },
// });
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Video from "react-native-video"; // Thư viện video cho React Native
import { useRoute } from "@react-navigation/native"; // Lấy dữ liệu từ navigation
import PlaylistItem from "../components/PlaylistItem"; // Import PlaylistItem component

const CourseDetailsScreen = () => {
  const route = useRoute();
  const { item } = route.params; // Dữ liệu item từ Firebase, truyền từ HomeScreen
  const [showDescription, setShowDescription] = useState(false); // Quản lý trạng thái hiển thị
  const [playlist, setPlaylist] = useState([]); // Danh sách phát
  const [currentVideoUri, setCurrentVideoUri] = useState(item.introVideo); // Video hiện tại để phát

  useEffect(() => {
    // Chuyển đổi đối tượng playlist thành mảng
    if (item.playlist) {
      const convertedPlaylist = Object.values(item.playlist); // Lấy giá trị của playlist
      setPlaylist(convertedPlaylist);
    }
  }, [item]);

  // Hàm chuyển đổi hiển thị mô tả hoặc playlist
  const toggleContent = (contentType) => {
    setShowDescription(contentType === "description");
  };

  // Hàm phát video khi nhấn vào một mục trong playlist
  const handlePlayVideo = (videoUri) => {
    setCurrentVideoUri(videoUri); // Cập nhật video hiện tại
  };

  const renderPlaylistItem = ({ item }) => (
    <PlaylistItem item={item} onPlay={() => handlePlayVideo(item.videoUri)} />
  );

  const renderContent = () => {
    if (showDescription) {
      return <Text style={styles.description}>{item.description}</Text>;
    } else {
      if (playlist.length < 1) {
        return null;
      } else {
        return (
          <View style={styles.card}>
            <FlatList
              data={playlist} // Sử dụng playlist đã được chuyển đổi thành mảng
              renderItem={renderPlaylistItem}
              keyExtractor={(item, index) => index.toString()} // Sử dụng key duy nhất cho mỗi item
            />
          </View>
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Phần video */}
      <Video
        source={{ uri: currentVideoUri }} // Phát video hiện tại
        style={styles.videoPlayer}
        controls={true}
        resizeMode="cover"
      />

      {/* Thông tin khóa học */}
      <View style={styles.infoContainer}>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <Text style={styles.createdBy}>Created by {item.postedByName}</Text>

        {/* Rating và Duration */}
        <View style={styles.row}>
          <Image
            source={require("./../assets/star.png")} // Đường dẫn đến icon play
            style={styles.starIcon}
          />
          <Text style={styles.rating}>{item.rating}</Text>
          <Image
            source={require("./../assets/clock.png")} // Đường dẫn đến icon play
            style={styles.clockIcon}
          />
          <Text style={styles.duration}>{item.duration} minutes</Text>
          <Text style={styles.price}>${item.price}</Text>
        </View>
      </View>

      {/* Nút Description và Playlist */}
      <View style={styles.card}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => toggleContent("playlist")}>
            <Text
              style={[styles.btnText, !showDescription && styles.activeBtn]}
            >
              Playlist
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleContent("description")}>
            <Text style={[styles.btnText, showDescription && styles.activeBtn]}>
              Description
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hiển thị Mô tả hoặc Playlist */}
      <View style={{ flex: 1 }}>{renderContent()}</View>

      {/* Nút Enroll */}
      <View style={styles.enrollContainer}>
        <Button title="Enroll Now" onPress={() => alert("Enrolled")} />
      </View>
    </View>
  );
};

export default CourseDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  videoPlayer: {
    width: "100%",
    height: 200,
    backgroundColor: "black",
  },
  infoContainer: {
    marginTop: 20,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  createdBy: {
    marginTop: 5,
    fontSize: 16,
    color: "#666",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
    marginTop: 10,
    alignItems: "center",
  },
  rating: {
    marginLeft: 5,
    fontSize: 16,
  },
  duration: {
    marginLeft: 10,
    fontSize: 16,
  },
  price: {
    marginLeft: "auto",
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    marginTop: 20,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 5,
    // elevation: 3,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 15,
  },
  activeBtn: {
    backgroundColor: "#19B5FE",
    // color: "blue", // Đổi màu nút khi được chọn
    color: "white",
    padding: 5,
    borderRadius: 5,
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
  },
  enrollContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  starIcon: {
    width: 20,
    height: 20,
    alignItems: "center",

    // tintColor: "#FFFFFF", // Đổi màu icon thành màu trắng
  },
  clockIcon: {
    width: 18,
    height: 18,
    marginLeft: 20,
    alignItems: "center",
    // tintColor: "#FFFFFF", // Đổi màu icon thành màu trắng
  },
});
