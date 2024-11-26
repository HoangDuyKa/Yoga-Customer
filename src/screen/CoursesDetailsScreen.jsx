import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Video from "react-native-video"; // Thư viện video cho React Native
import { useRoute } from "@react-navigation/native"; // Lấy dữ liệu từ navigation
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import PlaylistItem from "../components/PlaylistItem"; // Import PlaylistItem component

// code broken down into main core sections, with each segment of code followed by an explanation:

const CourseDetailsScreen = () => {
  const route = useRoute();
  const { item } = route.params; // Dữ liệu item từ Firebase, truyền từ HomeScreen
  const [showDescription, setShowDescription] = useState(false); // Quản lý trạng thái hiển thị
  const [playlist, setPlaylist] = useState([]); // Danh sách phát
  const [currentVideoUri, setCurrentVideoUri] = useState(item.introVideo); // Video hiện tại để phát

  const [isEnrolled, setIsEnrolled] = useState(false); // Track enrollment status

  useEffect(() => {
    checkEnrollmentStatus();
  }, []);

  // Function to check if the user is already enrolled in the course
  const checkEnrollmentStatus = async () => {
    const user = auth().currentUser;
    if (user) {
      const userId = user.uid;

      try {
        // Check if there is an active booking for this course
        const bookingSnapshot = await database()
          .ref(`/Booking`)
          .orderByChild("courseId")
          .equalTo(item.id)
          .once("value");

        const bookingData = bookingSnapshot.val();

        if (bookingData) {
          // Check if the user has an unbooked entry for this course
          const isAlreadyEnrolled = Object.values(bookingData).some(
            (booking) => booking.userId === userId
            // && !booking.bookingStatus.booked
          );

          setIsEnrolled(isAlreadyEnrolled); // Update enrollment status
        } else {
          setIsEnrolled(false); // No bookings found
        }
      } catch (error) {
        console.error("Error checking enrollment status:", error);
        setIsEnrolled(false); // Assume not enrolled in case of error
      }
    } else {
      setIsEnrolled(false); // User is not logged in
    }
  };

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

  const handleEnroll = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const userId = user.uid;

        // Add a new booking entry
        const bookingId = database().ref().child("Booking").push().key; // Generate unique ID
        await database()
          .ref(`/Booking/${bookingId}`)
          .set({
            userId: userId,
            courseId: item.id,
            bookingDate: new Date().toISOString(),
            bookingStatus: {
              booked: false,
            },
          });

        setIsEnrolled(true); // Update state to reflect enrollment
        Alert.alert(
          "Enrollment Successful",
          "You have been enrolled in the course and your booking has been created!"
        );
      } else {
        Alert.alert("Error", "Please log in to enroll in this course.");
      }
    } catch (error) {
      console.error("Enrollment Error:", error);
      Alert.alert("Enrollment Failed", "An error occurred. Please try again.");
    }
  };

  const handleUnenroll = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const userId = user.uid;

        // Find and remove the booking from the Booking table
        const bookingSnapshot = await database()
          .ref(`/Booking`)
          .orderByChild("courseId")
          .equalTo(item.id)
          .once("value");

        const bookingData = bookingSnapshot.val();
        if (bookingData) {
          const bookingKey = Object.keys(bookingData).find(
            (key) => bookingData[key].userId === userId
          );

          if (bookingKey) {
            await database().ref(`/Booking/${bookingKey}`).remove();
          }
        }

        setIsEnrolled(false); // Update state to reflect unenrollment
        Alert.alert(
          "Unenrollment Successful",
          "You have been unenrolled from the course and your booking has been removed."
        );
      } else {
        Alert.alert("Error", "Please log in to unenroll from this course.");
      }
    } catch (error) {
      console.error("Unenrollment Error:", error);
      Alert.alert(
        "Unenrollment Failed",
        "An error occurred. Please try again."
      );
    }
  };

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

        {/* DayOfWeek + Time và Type */}
        <View style={styles.row}>
          <Image
            source={require("./../assets/schedule.png")} // Đường dẫn đến icon play
            style={styles.starIcon}
          />
          <Text style={styles.rating}>{item.dayOfWeek}</Text>
          <Text style={styles.duration}>{item.time}</Text>
          <Text style={styles.type}>{item.type}</Text>
        </View>

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
        {isEnrolled ? (
          <TouchableOpacity
            onPress={handleUnenroll}
            style={styles.buttonUnenroll}
          >
            <Text style={styles.buttonText}>Unenroll</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleEnroll} style={styles.buttonEnroll}>
            <Text style={styles.buttonText}>Enroll Now</Text>
          </TouchableOpacity>
        )}
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
  },type:{marginLeft: "auto",
    fontSize: 20,},
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
  buttonEnroll: {
    backgroundColor: "#19B5FE",

    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF", // Customize as needed
    textTransform: "none", // Ensure no transformation
  },
  buttonUnenroll: {
    backgroundColor: "#E96E6E", // Customize as needed
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
