import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import BottomNav from "../components/General/BottomNav";

const AdminInsights = () => {
    return (
        <div className="p-6 h-screen w-full bg-white">
            {/* Top Header */}
            <header className="flex justify-between items-center mb-12">
                {/* Back Arrow Button */}
                <div>
                    <button
                        className="bg-white h-12 w-12 rounded-full border-2 border-gray-200 text-2xl font-bold text-black flex items-center justify-center">
                        <FaArrowLeftLong />
                    </button>
                </div>
                {/* Admin Insights Heading */}
                <div className="text-3xl font-semibold text-gray-900 text-center">Admin Insights</div>
            </header>

            {/* Stats Boxes */}
            <div className="flex justify-around mt-12">
                <div className="h-40 w-40 bg-[#2F4DA7] rounded-3xl p-5 text-center text-lg font-semibold text-gray-50 flex flex-col justify-center items-center">
                    <p className="text-6xl">70</p>
                    <p className="text-xl">Shopkeepers Registered</p>
                </div>
                <div className="h-40 w-40 bg-white rounded-3xl p-6 text-lg border-4 border-[#2F4DA7] font-semibold text-[#2F4DA7] flex flex-col justify-center text-center items-center">
                    <p className="text-6xl">70</p>
                    <p className="text-xl">Students Registered</p>
                </div>
            </div>

            {/* Request Section */}
            <div className="mt-5">
                <p className="ml-3 text-2xl font-semibold text-gray-900 mb-4">Incoming Requests</p>
                <div className="bg-white mt-4 border shadow-md rounded-xl px-4 py-4 text-lg font-medium text-gray-900 flex flex-col items-start">
                    <p className="text-justify"><b>Name:</b> Ram</p>
                    <p className="text-justify"><b>Email:</b> ram@gmail.com</p>
                    <p className="text-justify">
                        <b>Restaurant:</b> Deshraj Sweets
                    </p>
                    <div className="flex mt-4">
                        <button
                            className="w-36 h-12 bg-green-200 text-lg font-bold text-black rounded-lg border-2 border-green-300 mr-4 active:scale-95">
                            Accept
                        </button>
                        <button
                            className="w-36 h-12 bg-red-200 text-lg font-bold text-black rounded-lg border-2 border-red-300 active:scale-95">
                            Deny
                        </button>
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
};

export default AdminInsights;
