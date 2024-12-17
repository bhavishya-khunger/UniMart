import React from 'react';
import BottomNav from '../components/General/BottomNav';
import { BsWallet2 } from 'react-icons/bs';
import Transaction from '../components/Wallet/Transaction';

const Wallet = () => {
    return (
        <>
            <div className="px-3 py-4 w-screen h-full select-none bg-gray-100">
                <div className='bg-[url("https://media.istockphoto.com/id/1344873588/vector/blank-empty-textured-effect-horizontal-vector-backgrounds-of-a-creative-bright-vibrant-red.jpg?s=612x612&w=0&k=20&c=YnKM0isqet9m3Uuca85PmSokvnct0x6AJwbyX-K8xCA=")] h-fit rounded-3xl py-4 px-4'>
                    <div className="flex justify-between">
                        <h1 className="text-white font-semibold text-2xl">UniPoints</h1>
                        <button className="text-white border px-2 rounded-full active:scale-95">+ Add</button>
                    </div>
                    <div className="mt-3 flex gap-2 items-center">
                        <BsWallet2 size={30} color="#fde047" />
                        <h1 className="text-4xl text-yellow-300 font-semibold">40pts</h1>
                    </div>
                    <div className="text-red-50 pt-4 pb-2 border-t border-dashed border-red-50 mt-5 flex flex-col">
                        <span>ABC</span>
                        <span>SID: XXXXXXXX</span>
                        <span className="text-xs">abc@gmail.com</span>
                    </div>
                </div>
                <div className="mt-5 shadow rounded-xl bg-white h-fit w-full px-3 py-4 flex flex-col items-center">
                    <p>#Referral System Goes Here#</p>
                    <button className="mt-2 self-center py-2 w-full rounded-xl text-white bg-red-600">
                        Share Invite Code
                    </button>
                </div>
                <p className="mt-3 font-semibold text-lg">Recent Transactions</p>
                <div className='bg-gray-100'>
                    <Transaction/>
                </div>
                <div className="h-20"></div>
            <BottomNav />
            </div>
        </>
    );
};

export default Wallet;
