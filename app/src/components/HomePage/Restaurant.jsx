import React from "react";

function Restaurant({restaurantImage, restaurantName}) {
  return (
    <div className="restaurantItem w-[90vw] bg-gray-400 rounded-2xl border-4 [border-style:ridge] border-orange-600 flex flex-col">
      <div className="imageContainer">
        <img
          src={restaurantImage}
          alt="burger"
          className="h-32 w-[90vw]"
        />
      </div>
      <h3 className="text-xl">{restaurantName}</h3>
    </div>
  );
}

export default Restaurant;
