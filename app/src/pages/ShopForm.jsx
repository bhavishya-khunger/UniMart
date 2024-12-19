import React, { useState, useEffect } from 'react';
import InputVal from '../components/General/InputVal';
import Loading from '../components/General/Loading';
import { useNavigate } from 'react-router-dom';
import ErrorPop from '../components/General/ErrorPop';
import axios from 'axios';

const ShopForm = () => {
    const [shopName, setShopName] = useState('');
    const [shopImage, setShopImage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleSubmit = async () => {
        if (!shopName || !shopImage) {
            setError('All fields are required.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_SHOP_BASE_URL}/create-shop`,
                { shopName, shopImage, owner: user._id }
            );
            console.log(res);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            const userhai = localStorage.getItem('user');
            console.log('User:', userhai);
            console.log('Shop Created:', res.data.user);
            setSubmitted(true);
        } catch (error) {
            console.log('Error Response:', error?.response);
            setError(error?.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (submitted) {
            navigate('/');
        }
    }, [submitted, navigate]);

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <header className="flex flex-col items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 40 40">
                    <path
                        fill="#F06225"
                        d="M20 0c11.046 0 20 8.954 20 20v14a6 6 0 0 1-6 6H21v-8.774c0-2.002.122-4.076 1.172-5.78a10 10 0 0 1 6.904-4.627l.383-.062a.8.8 0 0 0 0-1.514l-.383-.062a10 10 0 0 1-8.257-8.257l-.062-.383a.8.8 0 0 0-1.514 0l-.062.383a9.999 9.999 0 0 1-4.627 6.904C12.85 18.878 10.776 19 8.774 19H.024C.547 8.419 9.29 0 20 0Z"
                    ></path>
                    <path
                        fill="#F06225"
                        d="M0 21h8.774c2.002 0 4.076.122 5.78 1.172a10.02 10.02 0 0 1 3.274 3.274C18.878 27.15 19 29.224 19 31.226V40H6a6 6 0 0 1-6-6V21ZM40 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                    ></path>
                </svg>
                <h1 className="font-bold mt-2 text-2xl text-center mb-8">
                    Just a few steps away from setting up your shop!
                </h1>
            </header>
            <main>
                <InputVal value={shopName} onChange={(e) => setShopName(e.target.value)} fieldVal="Shop's Name (to be displayed)" type="text" />
                <InputVal value={shopImage} onChange={(e) => setShopImage(e.target.value)} fieldVal="Display Image Link" type="text" />
                <div className="flex flex-col items-center justify-center w-[80vw]">
                    {loading && <Loading />}
                    {error && <ErrorPop text={error} />}
                </div>
            </main>
            <footer className="flex flex-col mt-6">
                <button
                    onClick={handleSubmit}
                    className="bg-[#FF4539] text-white text-xl px-6 py-3 font-semibold rounded-full w-[80vw] mb-4 active:scale-95"
                >
                    Proceed
                </button>
            </footer>
        </div>
    );
};

export default ShopForm;
