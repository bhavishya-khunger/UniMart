import React, { useEffect, useState } from 'react'
import BottomNav from '../components/General/BottomNav'
import { FaArrowLeftLong, FaPencil } from 'react-icons/fa6'
import Item from '../components/Restaurant/Item'
import { BiPlus, BiPlusCircle } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const MenuShop = () => {
    const navigate = useNavigate();
    const [menu, setMenu] = useState([]);
    const currUser = JSON.parse(localStorage.getItem("user"));
    useEffect(() => {
        const getMenuItems = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_PRODUCT_BASE_URL}/menu/${currUser?._id}`);
                setMenu(res.data.products);
            } catch (error) {
                console.log(error);
            }
        }

        getMenuItems();
    }, [menu]);

    return (
        <div className='w-full h-full bg-white'>
            <header className="sticky w-full bg-white top-0 flex justify-between items-center py-4 px-6">
                <div className='flex items-center gap-2'>
                    <FaPencil size={18} />
                    <div className="text-center text-2xl text-black font-semibold">
                        Edit Menu
                    </div>
                </div>
                <button onClick={() => navigate('/editmenu/add')} className='p-1 rounded-full bg-[#ff4539] text-white shadow-2xl border-2 border-red-600 flex gap-1 items-center px-2 active:scale-90'>
                    <BiPlus size={18} /> <span>Add Item</span>
                </button>
            </header>
            <div className='px-4 py-1'>
                {menu && menu.map((prod) => {
                    return (
                        <Item key={prod?._id} itemId={prod?._id} itemName={prod?.productName} itemImage={prod?.productImg} itemDesc={prod?.desc} itemPrice={prod?.price} isVeg={prod?.isVeg} />
                    )
                })}
                <div className='h-96 w-full text-sm text-center italic p'>Add your items to the menu by clicking the above 'Add item' button.</div>
            </div>
            <BottomNav />
        </div>
    )
}

export default MenuShop
