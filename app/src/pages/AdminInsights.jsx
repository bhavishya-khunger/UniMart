import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import BottomNav from "../components/General/BottomNav";
import axios from 'axios';
import Request from "../components/Admin/Request";

const AdminInsights = () => {
    const [requests, setRequests] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    useEffect(() => {
        const getShops = async () => {
            const response = await axios.get(`${import.meta.env.VITE_SHOP_BASE_URL}/get-shops`);
            // console.log(response.data.users);
            setRestaurants(response.data.shops);
          }
          getShops();
        const getUnverifiedShops = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_SHOP_BASE_URL}/get-unverified`);
                setRequests(res.data.shops);
                console.log(res);
            } catch (error) {
                console.log(error);
            }
        } 
        getUnverifiedShops();
    }, [])
    const verifyShop = async (shopId) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_USER_BASE_URL}/verify-shop`, {
                shopId: shopId
            })
            console.log("res : ", res);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="p-6 h-screen w-full bg-white">
            {/* Top Header */}
            <header className="flex justify-center items-center mb-12">
                {/* Admin Insights Heading */}
                <div className="text-3xl font-semibold text-gray-900 text-center">Admin Insights</div>
            </header>

            {/* Stats Boxes */}
            <div className="flex justify-around mt-12">
                <div className="h-40 w-40 bg-[#2F4DA7] rounded-3xl p-5 text-center text-lg font-semibold text-gray-50 flex flex-col justify-center items-center">
                    <p className="text-6xl">{restaurants?.length}</p>
                    <p className="text-xl">Shopkeepers Registered</p>
                </div>
                <div className="h-40 w-40 bg-white rounded-3xl p-6 text-lg border-4 border-[#2F4DA7] font-semibold text-[#2F4DA7] flex flex-col justify-center text-center items-center">
                    <p className="text-6xl">1</p>
                    <p className="text-xl">Students Registered</p>
                </div>
            </div>

            {/* Request Section */}
            <div className="mt-5">
                <p className="ml-3 text-center text-2xl font-semibold text-gray-900 mb-4">Incoming Requests</p>
                {requests && requests.map((req) => {
                    return (
                        <Request onClick={verifyShop(req?._id)} key={req?._id} name={req?.owner?.name} email={req?.owner?.email} shopName={req?.shopName} />
                    )
                })}
            </div>
            <BottomNav />
        </div>
    );
};

export default AdminInsights;
