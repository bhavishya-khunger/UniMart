import React, { useEffect, useState } from 'react';
import BottomNav from '../components/General/BottomNav';
import { BsCopy, BsWallet2 } from 'react-icons/bs';
import Transaction from '../components/Wallet/Transaction';
import axios from 'axios';

const Wallet = () => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(referalCode).then(() => {
            alert(`Referral code (${referalCode}) copied to clipboard!`);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };
    const currUser = JSON.parse(localStorage.getItem('user'));
    const referalCode = currUser?.referalCode; // This should be fetched from the backend 

    return (
        <>
            <div className="px-3 py-4 w-screen h-full select-none bg-white">
                <div className='bg-[url("https://static.vecteezy.com/system/resources/thumbnails/011/731/472/small/orange-abstract-background-with-geometric-shapes-concept-free-vector.jpg")] bg-cover h-fit rounded-3xl py-4 px-4'>
                    <div className="flex justify-between">
                        <h1 className="text-white font-semibold text-2xl">UniPoints</h1>
                        <button className="text-white border px-2 rounded-full active:scale-95">+ Add</button>
                    </div>
                    <div className="mt-3 flex gap-2 items-center">
                        <BsWallet2 size={30} color="#fde047" />
                        <h1 className="text-4xl text-yellow-300 font-semibold">{currUser?.coins}pts</h1>
                    </div>
                    <div className="text-red-50 pt-4 pb-2 border-t border-dashed border-red-50 mt-5 flex flex-col">
                        <span>{currUser?.name}</span>
                        {currUser?.role === 'Student' && <span className="text-xs">Student</span>}
                        <span className="text-xs">{currUser?.email}</span>
                    </div>
                </div>
                {currUser?.role === 'Student' && (
                    <div className="mt-5 border border-gray-200 shadow-lg rounded-xl bg-white h-fit w-full px-3 py-4 flex flex-col items-center">
                        <p>Your Unique referal code is</p>
                        <p className='text-xl font-mono'>{referalCode}</p>
                        <p className='text-center text-sm italic'>Share the code with your friends and earn 20 coins!</p>
                        <button onClick={copyToClipboard} className="mt-2 flex justify-center gap-3 self-center py-2 w-full rounded-xl items-center text-white bg-[#FF4539] active:scale-95">
                            {/* #FF4539 - use this when u change */}
                            <BsCopy />Copy Invite Code
                        </button>
                    </div>
                )}
                <p className="mt-3 font-semibold text-lg">Recent Transactions</p>
                <div className='bg-white'>
                    {currUser?.transactionHistory?.length === 0 && <p className="text-center mt-4 text-gray-400">No transactions yet!</p>}
                    {currUser?.transactionHistory?.map((transaction, index) => (
                        <Transaction key={index} transaction={transaction} />
                    ))}
                </div>
                <div className="h-20"></div>
                <BottomNav />
            </div>
        </>
    );
};

export default Wallet;
