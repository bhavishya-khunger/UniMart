import React from "react";

function FoodItem({foodImage, foodName}) {
  return (
    <div className="bg-gray-100 w-24 flex-shrink-0 hover:bg-gray-200 rounded-3xl flex flex-col items-center py-2">
      <img src={foodImage} alt="burger" className="h-20" />
      <p className="text-center text-sm">{foodName}</p>
    </div>
  );
}

export default FoodItem;
