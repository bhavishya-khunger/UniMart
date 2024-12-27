import React from 'react'
import { AiFillHome, AiOutlineUser, AiOutlineWallet } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { BiFoodMenu } from "react-icons/bi";
import { MdAdminPanelSettings } from "react-icons/md";
import { IoBagCheckOutline } from "react-icons/io5";

const BottomNav = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <nav className="fixed shadow-2xl shadow-gray-600 bottom-0 left-0 w-full bg-white py-3 flex justify-around items-center">
            <Link to={'/wallet'} className="flex flex-col items-center text-gray-600 hover:text-orange-500">
                <AiOutlineWallet className="text-2xl" />
                <span className="text-sm">Wallet</span>
            </Link>
            {user?.role !== 'Admin' && (
                <Link to={'/'} className="flex flex-col items-center text-gray-600 hover:text-orange-500">
                    <AiFillHome className="text-2xl" />
                    <span className="text-sm">Home</span>
                </Link>
            )}
            {user?.role === 'Admin' && (
                <Link to={'/admininsights'} className="flex flex-col items-center text-gray-600 hover:text-orange-500">
                    <MdAdminPanelSettings className="text-2xl" />
                    <span className="text-sm">Admin Insights</span>
                </Link>
            )}
            {user?.role === 'Shopkeeper' && (
                <Link to={'/editmenu'} className="flex flex-col items-center text-gray-600 hover:text-orange-500">
                    <BiFoodMenu className="text-2xl" />
                    <span className="text-sm">Menu</span>
                </Link>
            )}
            <Link to={'/order'} className="flex flex-col items-center text-gray-600 hover:text-orange-500">
                <IoBagCheckOutline className="text-2xl" />
                <span className="text-sm">Order</span>
            </Link>
            {user?.role !== 'Admin' && (
                <Link to={'/userpage'} className="flex flex-col items-center text-gray-600 hover:text-orange-500">
                    <AiOutlineUser className="text-2xl" />
                    <span className="text-sm">Profile</span>
                </Link>
            )}
        </nav>
    )
}

export default BottomNav
