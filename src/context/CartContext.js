import { createContext, useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [countCart, setCountCart] = useState(0);

  useEffect(() => {
    const unsubscribe = setupCountCartListener();
    return () => unsubscribe && unsubscribe(); // Clean up the listener on component unmount
  }, []);

  const setupCountCartListener = () => {
    const user = auth().currentUser;
    if (user) {
      const userId = user.uid;
      const ref = database().ref(`/user_details/${userId}/enrolled_courses`);

      // Set up listener for changes
      const listener = ref.on("value", (snapshot) => {
        const enrolledCourses = snapshot.val();
        const count = enrolledCourses ? Object.keys(enrolledCourses).length : 0;
        setCountCart(count);
      });

      // Return a function to unsubscribe from the listener
      return () => ref.off("value", listener);
    } else {
      console.log("No user is signed in");
      return null;
    }
  };

  return (
    <CartContext.Provider value={{ countCart }}>
      {children}
    </CartContext.Provider>
  );
};
