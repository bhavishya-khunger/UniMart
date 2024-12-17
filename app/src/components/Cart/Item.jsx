import React from 'react'

const Item = ({RestaurantName, ItemName, ItemImg, ItemPrice, ItemQty}) => {
  return (
    <div className='w-full h-fit flex border-t border-b items-center justify-between px-2 gap-2'>
      <span className='h-full flex gap-2 items-center'>
      <img src={ItemImg} alt="" className='w-16 h-16' />
      <div className='flex flex-col'>
        <p className='text-lg font-semibold'>{ItemName}</p>
        <p className='text-sm'>{RestaurantName}</p>
      </div>
      </span>
      <div className=''>₹{ItemPrice} &times; {ItemQty}</div>
    </div>
  )
}

export default Item
