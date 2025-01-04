import React, { useContext, useEffect, useState } from "react";
import { FaArrowLeftLong, FaAngleRight } from "react-icons/fa6";
import { IoIosMenu } from "react-icons/io";
import Item from "../components/Restaurant/Item";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from '../context/UserContext'

const Restaurant = () => {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [shopName, setShopName] = useState("");
  const shopId = useParams().shopId;
  // // console.log("Shop ID:", shopId);


  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);

  const addToCart = async (productId) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_CART_BASE_URL}/add`, {
        userId: user._id,
        productId,
      });
      // console.log("Item added to cart:", response.data);


      setCartItems(response.data.items);
    } catch (error) {
      // console.error("Error adding item to cart:", error.message);


    }
  }

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_CART_BASE_URL}/remove`, {
        userId: user._id,
        productId,
      });
      // console.log("Item removed from cart:", response.data);


      setCartItems(response.data.items);
    } catch (error) {
      // console.error("Error adding item to cart:", error.message);


    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_PRODUCT_BASE_URL}/${shopId}`);
        // console.log("Products fetched:", response);


        setItems(response.data.products);
        setShopName(response.data.shopName);
      } catch (error) {
        // console.error("Error getting products:", error.message);


      }
    };
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_CART_BASE_URL}/getcart/${user._id}`);
        // console.log("Cart fetched:", response.data);


        setCartItems(response.data.items);
      } catch (error) {
        // console.error("Error getting cart:", error.message);


      }
    }
    fetchCart();
    if (shopId) fetchProducts();
  }, [shopId, cartItems]);

  return (
    <div className="flex flex-col min-h-screen text-gray-800">
      <header className="flex fixed w-full items-center justify-between gap-16 bg-white shadow-md p-4">
        <FaArrowLeftLong onClick={() => navigate("/")} size={22} />
        <p className="text-xl font-bold text-black">{shopName}</p>
        <IoIosMenu size={30} />
      </header>

      <main className="flex-grow px-4 py-8 mt-12">
        <h1 className="text-xl font-bold mb-4">Snacks For You</h1>
        {items?.map((item) => (
          <Item
            key={item._id}
            cartQty={
              cartItems?.find((cartItem) => cartItem.productId._id === item._id)?.quantity || 0
            }
            onAddToCart={() => addToCart(item._id)}
            onRemoveFromCart={() => removeFromCart(item._id)}
            options={true}
            itemName={item?.productName}
            itemDesc={item?.desc}
            itemImage={item?.productImg}
            isVeg={item?.isVeg}
            itemPrice={item?.price}
          />
        ))}
        <div className="w-full h-14"></div>
      </main>

      <footer className="fixed bottom-0 rounded-t-2xl w-full bg-white shadow-2xl shadow-black py-4 px-6 flex items-center justify-between">
        <p className="font-semibold text-lg">{`${cartItems?.length} items added`}</p>
        <button
          id="menu"
          className="px-3 py-2 text-lg text-white bg-black rounded-lg flex items-center gap-2"
          onClick={(e) => {
            e.preventDefault();
            navigate("/cart", { state: { restaurantId: shopId } });
          }}
        >
          View Cart
          <FaAngleRight size={14} />
        </button>
      </footer>
    </div>
  );
};

export default Restaurant;
