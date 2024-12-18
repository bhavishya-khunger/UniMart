import React from 'react';

function OrderContainer({ restaurantName, itemsList, netPrice }) {
  return ( 
    <>
      <div className='flex items-center justify-between bg-white mb-4 border-2 w-[90vw] border-black rounded-md px-2 py-2'>
        <div>
          {/* Render the Restaurant Name */}
          <h1 className='text-2xl text-gray-700 font-semibold'>{restaurantName}</h1>
          {/* Iterate and render the itemsList */}
          <ul>
            {Object.entries(itemsList).map(([key, value]) => (
              <li key={key}>
                {value} x {key}
              </li>
            ))}
          </ul>
        </div>
        {/* Render the net price */}
        <h2>Total: ₹{netPrice}</h2>
      </div>
    </>
  );
}

export default OrderContainer;