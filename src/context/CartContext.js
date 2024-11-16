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
      const ref = database().ref(`/Booking`);

      // Set up listener for changes
      const listener = ref
        .orderByChild("userId")
        .equalTo(userId)
        .on("value", (snapshot) => {
          const bookings = snapshot.val();

          if (bookings) {
            // Filter bookings with bookingStatus.booked = false
            const count = Object.values(bookings).filter(
              (booking) =>
                booking.bookingStatus && booking.bookingStatus.booked === false
            ).length;

            setCountCart(count); // Update countCart state
          } else {
            setCountCart(0); // No bookings found
          }
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
