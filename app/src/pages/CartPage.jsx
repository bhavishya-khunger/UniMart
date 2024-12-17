import React, { useState } from "react";
import burgerImg from '../Images/HomePage/burger.png'
import Item from "../components/Cart/Item";
import { FaArrowLeftLong, FaChevronUp } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";

const CartPage = () => {
  const [bill, setBill] = useState(true);
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <header className="flex justify-start gap-16 items-center py-4 px-6">
        <button
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
        <div className="w-full py-3 shadow-xl bg-white mt-3 rounded-xl ">
          <Item ItemImg={burgerImg} ItemName={'Cheese Burger'} ItemPrice={60} ItemQty={1} RestaurantName={"Gyoza's Cafe"} />
          <Item ItemImg={"https://static.vecteezy.com/system/resources/thumbnails/036/290/866/small/ai-generated-french-fries-with-dipping-sauce-on-a-transparent-background-ai-png.png"} ItemName={'Masala Fries'} ItemPrice={80} ItemQty={1} RestaurantName={"Gyoza's Cafe"} />
        </div>

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
          Disclaimer: The website is still in development stage. All the orders processed are fake and are not delivered. <br/><br/>&copy; UniMart, 2025
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
            <span className="text-gray-600">140 pts</span>
          </div>

          <div className="flex justify-between items-center border-b py-2">
            <span className="text-gray-600">Delivery</span>
            <span className="text-gray-600">10 pts</span>
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
            <h3 className="text-black font-semibold">150 pts</h3>
          </div>
          <button
            id="process"
            className="bg-[#FF4539] text-white w-full py-3 text-lg font-medium rounded-lg active:scale-95"
          >
            Process Order
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CartPage;
