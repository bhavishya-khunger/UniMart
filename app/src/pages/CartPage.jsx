import React, { useState, useEffect, useContext } from "react";
import burgerImg from '../Images/HomePage/burger.png';
import Item from "../components/Cart/Item";
import { FaArrowLeftLong, FaChevronUp } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import ErrorPop from "../components/General/ErrorPop";
import { useLocation, useNavigate } from "react-router-dom";
import { UserDataContext } from '../context/UserContext';

const CartPage = () => {
  const { user } = useContext(UserDataContext);
  const [bill, setBill] = useState(false);
  const [sendToFriends, setSendToFriends] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [pickupTime, setPickUpTime] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [selfPickUp, setSelfPickUp] = useState(false);
  const [comments, setComments] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const restaurantId = location.state?.restaurantId;

  // const handleSelfPickUpChange = (isChecked) => {
  //   setSelfPickUp(isChecked);
  //   if (isChecked) setSendToFriends(false); // Ensure Friends Only is disabled when Self PickUp is selected
  // };

  const handleFriendsOnlyChange = (isChecked) => {
    setSendToFriends(isChecked);
    if (isChecked) setSelfPickUp(false); // Ensure Self PickUp is disabled when Friends Only is selected
  };

  const orderCart = async () => {
    try {
      // Step 1: Place the order
      const response1 = await axios.post(`${import.meta.env.VITE_CART_BASE_URL}/order`, {
        userId: user._id,
        comments: comments
      });
      // console.log("Order placed:", response1.data);

      // Step 2: Request the order (make sure this only happens once)
      const response2 = await axios.post(`${import.meta.env.VITE_CART_BASE_URL}/order/request`, {
        orderId: response1?.data?.order?._id,
        sendToFriends: sendToFriends
      });
      await axios.post(`${import.meta.env.VITE_CART_BASE_URL}/order/request`, {
        orderId: response1?.data?.order?._id,
        sendToFriends: sendToFriends
      });
      console.log("Request Sent:", response2.data);



      // Now that the order has been successfully placed and requested, navigate to the next page
      navigate('/cart/order');
    } catch (error) {
      // console.error("Error placing order:", error);


      setErrorText(error.response?.data?.message || "An error occurred while processing your order.");
    }
  };



  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_CART_BASE_URL}/getcart/${user._id}`);
        setCartItems(response.data.items);
        setTotalPrice(response.data.totalPrice);
      } catch (error) {
        // console.error("Error getting cart:", error.message);


      }
    };
    fetchCart();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <header className="flex justify-start gap-16 items-center py-4 px-6">
        <button
          onClick={() => navigate(`/${restaurantId}`)}
          className="bg-white h-12 w-12 rounded-full border-2 border-white text-black text-2xl font-bold flex justify-center items-center hover:bg-gray-200"
        >
          <FaArrowLeftLong />
        </button>
        <div className="text-center text-2xl text-black font-semibold">
          Checkout
        </div>
      </header>

      <main className="scrollbar flex flex-col items-center px-6 max-h-[440px] overflow-scroll">
        {cartItems.length === 0 && <ErrorPop text={'No items added to the cart yet!'} />}
        {cartItems?.length !== 0 && (
          <div className="w-full py-3 shadow-xl bg-white mt-3 rounded-xl">
            {cartItems.map((item) => (
              <Item
                key={item?._id}
                ItemImg={item?.productId?.productImg}
                ItemName={item?.productId?.productName}
                ItemPrice={item?.price}
                ItemQty={item?.quantity}
                RestaurantName={item?.productId?.shopName}
              />
            ))}
          </div>
        )}
        <div className="mt-8 w-full">
          <textarea
            onChange={(e) => setComments(e.target.value)}
            value={comments}
            className="w-full outline-none h-auto text-wrap py-2 px-3 rounded-xl border border-gray-400 resize-none overflow-hidden"
            placeholder="Add Comments (Optional)"
            maxLength={100}
          />

        </div>
        <div className="mt-4 text-xs text-center mb-8">
          Disclaimer: The website is still in development stage. All the orders processed are fake and are not delivered. <br /><br />&copy; UniMart, 2025
        </div>
      </main>

      <footer className="bg-white fixed w-full bottom-0 shadow-2xl rounded-t-3xl p-4 mt-4">
        <div onClick={() => setBill(!bill)} className="mb-4 flex items-center justify-between mr-3">
          <h3 className="text-black font-semibold text-xl">ORDER SUMMARY</h3>
          {bill ? <FaChevronDown /> : <FaChevronUp />}
        </div>

        <div className={bill ? 'w-full' : 'w-full hidden'}>
          <div className="flex justify-between items-center border-b py-2">
            <span className="text-gray-600">Food Total</span>
            <span className="text-gray-600">{totalPrice} pts</span>
          </div>
          <div className="flex justify-between items-center border-b py-2">
            <span className="text-gray-600">Delivery</span>
            <span className="text-gray-600">{Math.floor((8 / 100) * totalPrice)}pts</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col w-full justify-center">
          <div className="flex gap-6 justify-center items-center py-2">
            {/* <div className="flex self-center items-center mb-4">
              <input
                type="checkbox"
                id="selfPickUp"
                className="mr-2"
                checked={selfPickUp}
                onChange={(e) => handleSelfPickUpChange(e.target.checked)}
              />
              <label htmlFor="selfPickUp" className="self-center text-gray-700">Self PickUp</label>
            </div> */}
            {!selfPickUp && (
              <div className="flex self-center items-center mb-4">
                <input
                  type="checkbox"
                  id="friendsOnly"
                  className="mr-2"
                  checked={sendToFriends}
                  onChange={(e) => handleFriendsOnlyChange(e.target.checked)}
                />
                <label htmlFor="friendsOnly" className="self-center text-gray-700">Friends <b>Only</b></label>
              </div>
            )}
            {selfPickUp && (
              <div className="flex self-center items-center mb-4">
                <input
                  type="time"
                  className="mr-2 border py-1 px-2 border-gray-500 rounded-xl"
                  value={pickupTime}
                  onChange={(e) => setPickUpTime(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="flex justify-center items-center">
            {errorText && <ErrorPop text={errorText} />}
          </div>
          <div className="flex flex-col w-full justify-center">
            <div className="flex justify-between items-center py-2">
              <h3 className="text-black font-semibold">PAYMENT TOTAL</h3>
              <h3 className="text-black font-semibold">{Math.floor((108 / 100) * totalPrice)} pts</h3>
            </div>
          </div>
          <button
            disabled={totalPrice === 0}
            onClick={orderCart}
            id="process"
            className="bg-[#FF4539] text-white w-full py-3 text-lg font-medium rounded-lg active:scale-95 disabled:bg-gray-300 disabled:active:scale-100"
          >
            {selfPickUp ? "Place Order" : "Process Order"}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CartPage;
