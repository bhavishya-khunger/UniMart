import React from 'react'
import BottomNav from '../components/General/BottomNav'
import { FaArrowLeftLong } from 'react-icons/fa6'
import Item from '../components/Restaurant/Item'

const MenuShop = () => {
    const sample = {
        itemName: "Spicy Veggie Delight Pizza",
        itemDesc: "Loaded with fresh vegetables, tangy tomato sauce, and a generous layer of cheese.",
        itemImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3RhAkXrDXaU8_tVgEFovixM6eCSLN3CJl5Q&s",
        veg: true
    };
    return (
        <div className='w-full h-full shadow-lg bg-white'>
            <header className="sticky w-full bg-white top-0 flex justify-start gap-16 items-center py-4 px-6">
                <button
                    className="bg-white h-12 w-12 rounded-full border-2 border-white text-black text-2xl font-bold flex justify-center items-center hover:bg-gray-200"
                >
                    <FaArrowLeftLong />
                </button>
                <div className="text-center text-2xl text-black font-semibold">
                    Edit Menu
                </div>
            </header>
            <div className='px-4 py-1'>
                <Item itemName={sample.itemName} itemImage={sample.itemImage} itemDesc={sample.itemDesc} isVeg={sample.veg} />
                <Item itemName={sample.itemName} itemImage={sample.itemImage} itemDesc={sample.itemDesc} isVeg={sample.veg} />
                <Item itemName={sample.itemName} itemImage={sample.itemImage} itemDesc={sample.itemDesc} isVeg={sample.veg} />
                <Item itemName={sample.itemName} itemImage={sample.itemImage} itemDesc={sample.itemDesc} isVeg={sample.veg} />
                <Item itemName={sample.itemName} itemImage={sample.itemImage} itemDesc={sample.itemDesc} isVeg={sample.veg} options={false} />
                <div className='h-16 w-full'></div>
            </div>
            <BottomNav />
        </div>
    )
}

export default MenuShop
