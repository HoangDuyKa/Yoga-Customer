import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const PlaylistItem = ({ item, onPlay }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPlay(item)}>
      <View style={styles.roundView}>
        <Image
          source={require("./../assets/play.png")} // Đường dẫn đến icon play
          style={styles.playIcon}
        />
      </View>
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0", // Màu nền cho item, thay thế @drawable/edt_bg
    margin: 5,
    padding: 8,
    borderRadius: 10, // Để tạo các góc bo tròn
  },
  roundView: {
    width: 40,
    height: 40,
    backgroundColor: "#6200EE", // Thay thế @drawable/round_bg
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  playIcon: {
    width: 25,
    height: 25,
    tintColor: "#FFFFFF", // Đổi màu icon thành màu trắng
  },
  title: {
    fontSize: 16,
    color: "#000000",
    flex: 1, // Để phần title chiếm hết không gian còn lại
  },
});

export default PlaylistItem;
