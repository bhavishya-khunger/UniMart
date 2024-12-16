import React from "react";
import { BsStarFill } from "react-icons/bs";

function Restaurant({ restaurantImage, restaurantName, rating }) {
  return (
    <div className="bg-white shadow-lg w-full h-60 flex flex-col rounded-2xl overflow-hidden">
      {/* Background image container */}
      <img
        className="h-[75%]"
        src={restaurantImage}
        alt="No Img Available" />

      {/* Restaurant details */}
      <div className="px-3 flex justify-between items-center h-[25%]">
        <h2 className="text-xl font-bold">{restaurantName}</h2>
        <div className="bg-green-700 px-2 text-white rounded-lg flex items-center gap-1 font-semibold">
          {rating} <BsStarFill size={12} />
        </div>
      </div>
    </div>
  );
}

export default Restaurant;
