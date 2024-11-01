import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";

const ReorderScreen = () => {
  useFocusEffect(
    React.useCallback(() => {
      console.log("Reorder screen focused");
    }, [])
  );
  return (
    <View>
      <Text>Coming soon</Text>
    </View>
  );
};

export default ReorderScreen;

const styles = StyleSheet.create({});
