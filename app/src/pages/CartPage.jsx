import React, { useState, useEffect } from "react";
import burgerImg from '../Images/HomePage/burger.png'
import Item from "../components/Cart/Item";
import { FaArrowLeftLong, FaChevronUp } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import ErrorPop from "../components/General/ErrorPop";
import { useLocation, useNavigate } from "react-router-dom";

const CartPage = () => {
  const currUser = JSON.parse(localStorage.getItem("user"));
  const [bill, setBill] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const restaurantId = location.state?.restaurantId;
  const orderCart = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_CART_BASE_URL}/order`, {
        userId: currUser._id,
      });
      console.log("Order placed:", response.data);
      navigate('/cart/order');
    } catch (error) {
      console.error("Error placing order:", error);
      setErrorText(error.response.data.message);
    }
  }

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_CART_BASE_URL}/getcart/${currUser._id}`);
        console.log("Cart fetched:", response.data);
        setCartItems(response.data.items);
        setTotalPrice(response.data.totalPrice);
      } catch (error) {
        console.error("Error getting cart:", error.message);
      }
    }
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
        {/* Item Section */}
        {cartItems.length === 0 && (<ErrorPop text={'No items added to the cart yet!'} />)}
        {cartItems?.length !== 0 ? (<div className="w-full py-3 shadow-xl bg-white mt-3 rounded-xl ">
          {/* Item Component */}
          {cartItems.map((item) => (
            <Item key={item?._id} ItemImg={item?.productId?.productImg} ItemName={item?.productId?.productName} ItemPrice={item?.price} ItemQty={item?.quantity} RestaurantName={item?.productId?.shopName} />
          ))}
        </div>) : ""}

        {/* Promo Code Section */}
        {/* <div className="bg-white rounded-xl shadow-md mt-8 flex justify-between items-center w-full px-4 py-3 relative">
          <pre className="text-gray-500 text-xl">&#10857; PROMO CODE</pre>
          <button
            id="code"
            className="bg-[#FF4539] text-white px-4 py-2 rounded-lg text-lg font-medium"
          >
            Apply
          </button>
        </div> */}
        <div className="mt-4 text-xs text-center mb-8">
          Disclaimer: The website is still in development stage. All the orders processed are fake and are not delivered. <br /><br />&copy; UniMart, 2025
        </div>
      </main>

      <footer className="bg-white fixed w-full bottom-0 shadow-2xl rounded-t-3xl p-4 mt-4">
        {/* Order Summary */}
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
            <span className="text-gray-600">{(8 / 100) * totalPrice}</span>
          </div>

          <div className="flex justify-center items-center">
            {/* Error Pop */}
            {errorText && <ErrorPop text={errorText} />}
          </div>



          {/* <div className="flex justify-between items-center border-b py-2">
          <span className="text-gray-600">Discount</span>
          <span className="text-gray-600">-10&#8377;</span>
        </div> */}
        </div>
        {/* Process Order Button */}
        <div className="mt-4 flex flex-col w-full justify-center">
          <div className="flex justify-between items-center py-2">
            <h3 className="text-black font-semibold">PAYMENT TOTAL</h3>
            <h3 className="text-black font-semibold">{Math.floor((108 / 100) * totalPrice)} pts</h3>
          </div>
          <button
            disabled={totalPrice === 0}
            onClick={orderCart}
            id="process"
            className="bg-[#FF4539] text-white w-full py-3 text-lg font-medium rounded-lg active:scale-95 disabled:bg-gray-300 disabled:active:scale-100"
          >
            Process Order
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CartPage;
