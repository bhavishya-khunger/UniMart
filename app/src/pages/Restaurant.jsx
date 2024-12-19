import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoIosMenu } from "react-icons/io";
import Item from "../components/Restaurant/Item";
import { useNavigate } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";

const Restaurant = () => {
  const items = [
    {
      itemName: "Spicy Veggie Delight Pizza",
      itemDesc: "Loaded with fresh vegetables, tangy tomato sauce, and a generous layer of cheese.",
      itemImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3RhAkXrDXaU8_tVgEFovixM6eCSLN3CJl5Q&s",
      veg: true
    },
    {
      itemName: "Chocolate Fudge Brownie",
      itemDesc: "Rich and gooey brownie topped with melted chocolate and a scoop of vanilla ice cream.",
      itemImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaNscmIc8BbwCnCm-2JJW1TgBG17WNmQC1XQ&s",
      veg: true
    },
    {
      itemName: "Mango Smoothie",
      itemDesc: "Refreshing blend of ripe mangoes, yogurt, and a hint of honey.",
      itemImage: "https://cdn.loveandlemons.com/wp-content/uploads/2023/05/mango-smoothie-500x500.jpg",
      veg: true
    },
    {
      itemName: "Caesar Salad",
      itemDesc: "Crisp lettuce with creamy Caesar dressing, croutons, and a sprinkle of parmesan.",
      itemImage: "https://www.allrecipes.com/thmb/mXZ0Tulwn3x9_YB_ZbkiTveDYFE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/229063-Classic-Restaurant-Caesar-Salad-ddmfs-4x3-231-89bafa5e54dd4a8c933cf2a5f9f12a6f.jpg",
      veg: false
    },
    {
      itemName: "Garlic Butter Naan",
      itemDesc: "Soft and fluffy naan bread brushed with garlic butter and herbs.",
      itemImage: "https://allwaysdelicious.com/wp-content/uploads/2022/04/garlic-butter-naan-4.jpg",
      veg: true
    }
  ];
  const navigate = useNavigate();
  console.log(items);
  return (
    <div className="flex flex-col min-h-screen text-gray-800">
      <header className="flex fixed w-full items-center justify-between gap-16 bg-white shadow-md p-4">
        <FaArrowLeftLong onClick={() => navigate('/')} size={22} className="" />
        <p className="text-xl font-bold text-black">
          Gyoza Cafe
        </p>
        <IoIosMenu size={30} />
      </header>

      <main className="flex-grow px-4 py-8">
        <h1 className="text-xl font-bold mb-4">Snacks For You</h1>
        {items?.map((item) => {
          return (
            <Item options={true} itemName={item?.itemName} itemDesc={item?.itemDesc} itemImage={item?.itemImage} isVeg={item?.veg} />
          )
        })}
        <div className="w-full h-14"></div>
      </main>

      <footer className="fixed bottom-0 rounded-t-2xl w-full bg-white shadow-2xl shadow-black py-4 px-6 flex items-center justify-between">
        <p className="font-semibold text-lg">2 items added</p>
        <button
          id="menu"
          className="px-3 py-2 text-lg text-white bg-black rounded-lg flex items-center gap-2"
          onClick={(e) => {
            e.preventDefault();
            navigate('/cart');
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
