import React from 'react'
import { FcCurrencyExchange } from "react-icons/fc";

const Transaction = () => {
    return (
        <div className='bg-white mt-3 py-3 px-4 rounded-xl w-full h-fit flex justify-between'>
            <div className='flex gap-4 items-center'>
                <span className='border-black border rounded-full p-1'>
                    <FcCurrencyExchange size={35} />
                </span>
                <div className='flex flex-col justify-center'>
                    <span>Order Debit</span>
                    <span className='text-sm'>26 July, 2024</span>
                </div>
            </div>
            <div className='flex items-center text-lg'>
                - 70 pts
            </div>
        </div>
    )
}

export default Transaction
