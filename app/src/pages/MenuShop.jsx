import React from 'react'
import BottomNav from '../components/General/BottomNav'
import { FaArrowLeftLong, FaPencil } from 'react-icons/fa6'
import Item from '../components/Restaurant/Item'
import { BiPlus, BiPlusCircle } from 'react-icons/bi'

const MenuShop = () => {
    const sample = {
        itemName: "Spicy Veggie Delight Pizza",
        itemDesc: "Loaded with fresh vegetables, tangy tomato sauce, and a generous layer of cheese.",
        itemImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3RhAkXrDXaU8_tVgEFovixM6eCSLN3CJl5Q&s",
        veg: true
    };
    return (
        <div className='w-full h-full shadow-lg bg-white'>
            <header className="sticky w-full bg-white top-0 flex justify-between items-center py-4 px-6">
                <div className='flex items-center gap-2'>
                    <FaPencil size={18} />
                    <div className="text-center text-2xl text-black font-semibold">
                        Edit Menu
                    </div>
                </div>
                <button className='p-1 rounded-full bg-[#ff4539] text-white shadow-2xl border-2 border-red-600 flex gap-1 items-center px-2 active:scale-90'>
                    <BiPlus size={18} /> <span>Add Item</span>
                </button>
            </header>
            <div className='px-4 py-1'>
                <Item itemName={sample.itemName} itemImage={sample.itemImage} itemDesc={sample.itemDesc} isVeg={sample.veg} />
                <div className='h-96 w-full text-sm text-center italic p'>Add your items to the menu by clicking the above 'Add item' button.</div>
            </div>
            <BottomNav />
        </div>
    )
}

export default MenuShop
