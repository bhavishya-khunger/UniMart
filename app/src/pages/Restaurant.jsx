import React, { useEffect, useState } from "react";
import { FaArrowLeftLong, FaAngleRight } from "react-icons/fa6";
import { IoIosMenu } from "react-icons/io";
import Item from "../components/Restaurant/Item";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Restaurant = () => {
  const [items, setItems] = useState([]);
  const shopId = useParams().shopId;
  console.log("Shop ID:", shopId);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_PRODUCT_BASE_URL}/${shopId}`);
        console.log("Products fetched:", response.data.products);
        setItems(response.data.products);
      } catch (error) {
        console.error("Error getting products:", error.message);
      }
    };

    if (shopId) fetchProducts();
  }, [shopId]);

  return (
    <div className="flex flex-col min-h-screen text-gray-800">
      <header className="flex fixed w-full items-center justify-between gap-16 bg-white shadow-md p-4">
        <FaArrowLeftLong onClick={() => navigate("/")} size={22} />
        <p className="text-xl font-bold text-black">Gyoza Cafe</p>
        <IoIosMenu size={30} />
      </header>

      <main className="flex-grow px-4 py-8 mt-12">
        <h1 className="text-xl font-bold mb-4">Snacks For You</h1>
        {items?.map((item) => (
          <Item
            key={item._id}
            options={true}
            itemName={item?.productName}
            itemDesc={item?.desc}
            itemImage={item?.productImg}
            isVeg={item?.isVeg}
          />
        ))}
        <div className="w-full h-14"></div>
      </main>

      <footer className="fixed bottom-0 rounded-t-2xl w-full bg-white shadow-2xl shadow-black py-4 px-6 flex items-center justify-between">
        <p className="font-semibold text-lg">{`${items.length} items added`}</p>
        <button
          id="menu"
          className="px-3 py-2 text-lg text-white bg-black rounded-lg flex items-center gap-2"
          onClick={(e) => {
            e.preventDefault();
            navigate("/cart");
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
