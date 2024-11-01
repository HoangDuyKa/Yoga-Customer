import React, { createContext, useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userImage, setUserImage] = useState(
    "https://firebasestorage.googleapis.com/v0/b/yoga-f7065.appspot.com/o/profile_image%2Fuser_profile.jpg?alt=media&token=69413328-0e26-4fad-9900-a2112903c08e"
  );

  useEffect(() => {
    fetchUserImage();
  }, []);

  const fetchUserImage = async () => {
    const user = auth().currentUser;
    if (user) {
      const userId = user.uid;
      try {
        const snapshot = await database()
          .ref(`/user_details/${userId}/profile`)
          .once("value");

        const imageUrl = snapshot.val();
        if (imageUrl) setUserImage(imageUrl);
      } catch (error) {
        console.error("Error fetching user image:", error);
      }
    }
  };

  return (
    <UserContext.Provider value={{ userImage, setUserImage, fetchUserImage }}>
      {children}
    </UserContext.Provider>
  );
};
