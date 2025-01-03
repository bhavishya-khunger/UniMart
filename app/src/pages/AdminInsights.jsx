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
            // // console.log(response.data.users);


            setRestaurants(response.data.shops);
        }
        getShops();
        const getUnverifiedShops = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_SHOP_BASE_URL}/get-unverified`);
                setRequests(res.data.shops);
                // console.log(res);


            } catch (error) {
                // console.log(error);


            }
        }
        getUnverifiedShops();
    }, [])
    const verifyShop = async (shopId) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_USER_BASE_URL}/verify-shop`, {
                shopId: shopId
            })
            // console.log("res : ", res);


        } catch (error) {
            // console.log(error);


        }
    }
    return (
        <div className="p-6 h-screen w-full bg-white">
            {/* Top Header */}
            <header className="flex justify-center items-center mb-5">
                {/* Admin Insights Heading */}
                <div className="text-3xl font-semibold text-gray-900 text-center">Admin Insights</div>
            </header>

            {/* Stats Boxes */}
            <div className="flex justify-around">
                <div className="h-32 w-36 bg-[#2F4DA7] rounded-3xl p-5 text-center text-lg font-semibold text-gray-50 flex flex-col justify-center items-center">
                    <p className="text-6xl">{restaurants?.length}</p>
                    <p className="text-lg">Shopkeepers Registered</p>
                </div>
                <div className="h-32 w-36 bg-white rounded-3xl p-6 text-lg border-4 border-[#2F4DA7] font-semibold text-[#2F4DA7] flex flex-col justify-center text-center items-center">
                    <p className="text-6xl">1</p>
                    <p className="text-lg">Students Registered</p>
                </div>
            </div>

            {/* Cover Image Section */}
            <section className="mt-4 coverImageContainer flex justify-center items-center relative mb-4">
                <img
                    src="https://img.pikbest.com/templates/20240602/food-burger-restaurant-offer-web-banner-design_10587345.jpg!sw800"
                    alt="burger"
                    className="h-56 w-full max-w-xl rounded-3xl"
                />
            </section>
            <p>Days Left : 5</p>

            {/* Request Section */}
            <div className="mt-5">
                <p className="ml-3 text-center text-xl font-semibold text-gray-900 mb-4">Advertisement Requests</p>
                <div className="w-full mb-2 flex border border-gray-700 shadow-lg h-20 rounded-xl overflow-hidden">
                    <img src="https://www.literacyideas.com/wp-content/uploads/2021/08/1_img_6107cb72d2d9b.jpg" alt="" />
                    <div className="px-2 py-1">
                        <span className="block">Shop: FnK Cafe</span>
                        <span className="block">Duration: 30 days</span>
                        <span className="block">Bid: 30pts</span>
                    </div>
                </div>
                <div className="w-full mb-2 flex border border-gray-700 shadow-lg h-20 rounded-xl overflow-hidden">
                    <img src="https://www.literacyideas.com/wp-content/uploads/2021/08/1_img_6107cb72d2d9b.jpg" alt="" />
                    <div className="px-2 py-1">
                        <span className="block">Shop: FnK Cafe</span>
                        <span className="block">Duration: 30 days</span>
                        <span className="block">Bid: 30pts</span>
                    </div>
                </div>
                <div className="w-full mb-2 flex border border-gray-700 shadow-lg h-20 rounded-xl overflow-hidden">
                    <img src="https://www.literacyideas.com/wp-content/uploads/2021/08/1_img_6107cb72d2d9b.jpg" alt="" />
                    <div className="px-2 py-1">
                        <span className="block">Shop: FnK Cafe</span>
                        <span className="block">Duration: 30 days</span>
                        <span className="block">Bid: 30pts</span>
                    </div>
                </div>
            </div>

            {/* Request Section */}
            <div className="mt-5">
                <p className="ml-3 text-center text-xl font-semibold text-gray-900 mb-4">Incoming Shop Registrations</p>
                {requests && requests.map((req) => {
                    return (
                        <Request onClick={() => verifyShop(req?._id)} key={req?._id} name={req?.owner?.name} image={req?.shopImage} email={req?.owner?.email} shopName={req?.shopName} />
                    )
                })}
            </div>
            <div className="h-20"></div>
            <BottomNav />
        </div>
    );
};

export default AdminInsights;
