import { createContext, useEffect, useState } from "react"; // Import createContext and useState hooks from React
import axios from 'axios';
// Create a context for the store
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
 
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");
  const url = "http://localhost:4000";
  // Initialize the cartItems state
  const [cartItems, setCartItems] = useState({});

  // Function to add an item to the cart
  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 })); // If the item is not in the cart, add it with a quantity of 1
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 })); // If the item is in the cart, increment its quantity
    }
    if (token) {
      await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
    }
  };

  // Function to remove an item from the cart
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
    } // Decrement the item's quantity
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };
  
  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data); 
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
      console.log(response.data); // Log the response to check its structure
      if (response.data && response.data.cartData) {
        setCartItems(response.data.cartData);
      } else {
        console.error("cartData not found in response");
        setCartItems({});
      }
    } catch (error) {
      console.error("Failed to load cart data:", error);
      setCartItems({});
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  // Define the context value to be provided
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  // Return the StoreContext.Provider with the defined context value and the children components
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider; // Export the StoreContextProvider component
