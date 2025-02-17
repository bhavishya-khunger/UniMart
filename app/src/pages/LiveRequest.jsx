import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';

const OrderDetails = ({ data, shops }) => (
    <div className='max-w-80 w-fit px-8 border border-black bg-gray-100 mt-4 flex flex-col items-center justify-center py-3 rounded-xl'>
        <p className='text-lg font-semibold'>Order Details from {shops[0]?.shopName || "Unknown Shop"}</p>
        <ol className="list-decimal">
            {Array.isArray(data?.productDetails) && data.productDetails.map((product, index) => {
                return (
                    <>
                        <li key={index}>
                            {product?.totalPrice / product?.item?.price}
                            &nbsp;x&nbsp;
                            {product?.item?.productName}
                        </li>
                    </>
                );
            })}
        </ol>
    </div>
);

const LiveRequest = () => {
    const { socket } = useContext(SocketContext);
    const navigate = useNavigate();
    const [receivesInfo, setReceivesInfo] = useState(false);
    const [data, setData] = useState({});
    const [shops, setShops] = useState([]);
    const [delivery, setDelivery] = useState('');
    const { user } = useContext(UserDataContext);

    useEffect(() => {
        const handleOrderRequest = (info) => {
            // console.log("Received Order Data: ", info.order);
            setReceivesInfo(true);
            setData(info.order);
            setShops(info.shops);
            setDelivery(info.deliveryFee);
        };

        const handleOrderAccepted = () => {
            setShops([]);
            setDelivery('');
            setReceivesInfo(false);
            setData({});
            navigate('/order');
        };

        socket.on("order-request", handleOrderRequest);
        socket.on("order-accepted", handleOrderAccepted);

        return () => {
            socket.off("order-request", handleOrderRequest);
            socket.off("order-accepted", handleOrderAccepted);
        };
    }, [socket, navigate]);

    const acceptOrder = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_CART_BASE_URL}/order/confirm`,
                {
                    userId: user?._id,
                    orderId: data?._id,
                }
            );
            socket.emit("order-confirmed");
            navigate('/order');
        } catch (error) {
            // console.error('Error accepting order:', error?.response?.data || error.message);


            alert('An error occurred while accepting the order.');
        }
    };

    if (!receivesInfo) {
        return null;
    }

    return (
        <div className='flex items-center flex-col justify-center h-screen w-full'>
            <img
                className='h-32'
                src="https://media.istockphoto.com/id/1282872448/vector/warning-sign-attention-caution-exclamation-sign-alert-danger-vector-yellow-triangle-icon.jpg?s=612x612&w=0&k=20&c=RkqIlSkEBADX0mHStUz2Z1yJWkP3gb_c8uqJgiGOJeg="
                alt="Warning"
            />
            <h1 className='text-2xl font-semibold mt-6'>Incoming Order Request</h1>
            <p>from</p>
            <p className='text-lg font-semibold'>{data?.userId?.name}</p>
            <p className='text-lg font-semibold'>({data?.userId?.sid})</p>
            <p>for</p>
            <p className='text-3xl font-semibold'>{delivery}pts</p>
            <OrderDetails data={data} shops={shops} />
            <p>to</p>
            <p className='text-xl font-semibold'>{data?.userId?.address}</p>
            <div className='mt-10 justify-between flex w-full px-10'>
                <button
                    onClick={() => navigate('/')}
                    className='h-12 bg-yellow-500 text-black font-semibold text-xl rounded-xl w-32 active:scale-95'
                >
                    Ignore
                </button>
                <button
                    onClick={acceptOrder}
                    className='h-12 bg-green-600 text-white font-semibold text-xl rounded-xl w-32 active:scale-95'>
                    Accept
                </button>
            </div>
        </div>
    );
};

export default LiveRequest;