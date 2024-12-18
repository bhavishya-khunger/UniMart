import React from 'react'
import { AiFillHome, AiOutlineUser, AiOutlineWallet } from 'react-icons/ai'
import { Link } from 'react-router-dom'

const BottomNav = () => {
    return (
        <nav className="fixed shadow-2xl shadow-gray-600 bottom-0 left-0 w-full bg-white py-3 flex justify-around items-center">
            <Link to={'/wallet'} className="flex flex-col items-center text-gray-600 hover:text-orange-500">
                <AiOutlineWallet className="text-2xl" />
                <span className="text-sm">Wallet</span>
            </Link>
            <Link to={'/'} className="flex flex-col items-center text-gray-600 hover:text-orange-500">
                <AiFillHome className="text-2xl" />
                <span className="text-sm">Home</span>
            </Link>
            <Link className="flex flex-col items-center text-gray-600 hover:text-orange-500">
                <AiOutlineUser className="text-2xl" />
                <span className="text-sm">Profile</span>
            </Link>
        </nav>
    )
}

export default BottomNav
