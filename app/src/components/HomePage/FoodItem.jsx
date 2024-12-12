import React from "react";

function FoodItem({foodImage, foodName}) {
  return (
    <div className="item bg-gray-200 w-24 flex-shrink-0 hover:bg-orange-600 rounded-3xl">
      <img src={foodImage} alt="burger" className="h-20" />
      <p className="text-center">{foodName}</p>
    </div>
  );
}

export default FoodItem;
