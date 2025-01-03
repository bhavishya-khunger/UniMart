import React, { useContext, useEffect, useState } from 'react';
import BottomNav from '../components/General/BottomNav';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import axios from 'axios';
import { MdCall, MdDone } from 'react-icons/md';
import ErrorPop from '../components/General/ErrorPop';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const OrderPageNav = () => {
    const [placedOrders, setPlacedOrders] = useState([]);
    const [deliveryOrders, setDeliveryOrders] = useState([]);
    const { user, setUser } = useContext(UserDataContext);
    const [activeTab, setActiveTab] = useState(user?.role === "Student" ? "placed" : "past");
    const [otpCode, setOtpCode] = useState('');
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const submitOTP = async (orderId) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_CART_BASE_URL}/order/markDelivered`, {
                orderId: orderId,
                deliveryPersonId: user?._id,
                otp: otpCode
            });
            if (res.status === 200) {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_CART_BASE_URL}/order/process`, {
                        orderId: orderId
                    })
                    navigate('/wallet');
                } catch (error) {
                    // console.log(error);
                }
            }
        } catch (error) {
            // console.log(error);
            setError(error?.response?.data?.message);
        }
    }

    async function markAsPickedup(orderId) {
        try {
            await axios.post(`${import.meta.env.VITE_CART_BASE_URL}/order/markForDelivery`, {
                orderId: orderId,
                deliveryPersonId: user?._id
            });
        } catch (error) {
            // console.log(error);
        }
    }

    const getOrderDetails = async () => {
        const response = await axios.get(`${import.meta.env.VITE_CART_BASE_URL}/order/${user?._id}`);
        if (response.data.order) {
            setPlacedOrders(sortOrders(response.data.order));
        }
    }

    const getDeliveryOrders = async () => {
        const response = await axios.get(`${import.meta.env.VITE_CART_BASE_URL}/order/delivery/${JSON.parse(localStorage.getItem('user'))._id}`);
        if (response.data.orders) {
            setDeliveryOrders(response.data.orders);
        }
    }

    const markPrintAsPickedup = async (orderId) => {
        try {
            await axios.post(`${import.meta.env.VITE_SHOP_BASE_URL}/mark-as-picked`, {
                orderId: orderId,
                userId: user?._id
            });
        } catch (error) {
            // console.log(error);
        }
    }

    const sortOrders = (orders) => {
        return [...orders].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    };

    useEffect(() => {
        getOrderDetails();
        getDeliveryOrders();
    }, [placedOrders, deliveryOrders]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const tabStyle = (isActive) => ({
        cursor: 'pointer',
        borderBottom: isActive ? '2px solid blue' : 'none',
        padding: '10px',
        color: isActive ? 'blue' : 'black'
    });

    return (
        <div style={{ backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', position: "sticky", top: 0, background: "#fff", padding: '10px', borderBottom: '2px solid white' }}>
                {user?.role === "Student" && (
                    <>
                        <div onClick={() => handleTabClick('placed')} style={tabStyle(activeTab === 'placed')}>
                            Active Orders
                        </div>
                        <div onClick={() => handleTabClick('delivery')} style={tabStyle(activeTab === 'delivery')}>
                            Delivery Orders
                        </div></>
                )}
                <div onClick={() => handleTabClick('past')} style={tabStyle(activeTab === 'past')}>
                    Past Orders
                </div>
            </div>
            <TransitionGroup>
                <CSSTransition key={activeTab} timeout={300} classNames="fade">
                    <div style={{ padding: '20px' }}>

                        {/* Active Placed Orders */}

                        {activeTab === 'placed' && sortOrders(placedOrders)?.map((activeOrder) => {
                            return activeOrder?.pdfLink ? (
                                activeOrder?.orderStatus !== "Cancelled" && activeOrder?.orderStatus !== "Delivered" && (
                                    <section className="flex flex-col justify-between mb-6 py-2 px-4 rounded-lg bg-white shadow-lg border border-blue-500">
                                        <h2 className="bg-blue-600 text-gray-100 text-center mt-2 rounded-lg text-lg py-1 font-semibold">
                                            Order Status : {activeOrder?.orderStatus}
                                        </h2>
                                        <h2 className="bg-blue-800 text-white italic text-center text-base mt-2 rounded-lg py-1 font-semibold">
                                            Order ID : {activeOrder?._id}
                                        </h2>
                                        <h2 className="bg-blue-800 text-white italic text-center text-base mt-2 rounded-lg py-1 font-semibold">
                                            {activeOrder?.shopId?.shopName || "Not Found"}
                                        </h2>
                                        <p className="italic mt-2">
                                            The printing order placed at {activeOrder?.shopId?.shopName} needs to be picked up. Contact owner for more details.
                                        </p>
                                        <p><b>Added comments:</b> {activeOrder?.comments || "None"}</p>
                                        <div className="flex items-center justify-between px-3 w-full mt-3 h-fit py-2 rounded-xl bg-blue-100">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-red-400 text-white p-1 text-lg rounded-full h-10 w-10 flex items-center justify-center">{activeOrder?.shopId?.owner?.name[0]}</span>
                                                <span>
                                                    <p className="text-lg font-semibold">{activeOrder?.shopId?.owner?.name}</p>
                                                </span>
                                            </div>
                                            <span>
                                                <MdCall onClick={() => {
                                                    alert(`Call : ${activeOrder?.shopId?.owner?.phone}`)
                                                }} size={22} className="mr-2" />
                                            </span>
                                        </div>
                                        {activeOrder?.orderStatus === "Out for Delivery" && (
                                            <span className='w-full text-sm mt-3 text-center'>
                                                Your order is Out For Delivery. Kindly share the below OTP with {activeOrder?.deliveryPersonId?.name} to accept the order.
                                                <div className='text-lg bg-blue-600 text-white mt-2 rounded-lg'>OTP : {activeOrder?.otp}</div>
                                            </span>
                                        )}
                                        {activeOrder?.orderStatus === "Completed" && (
                                            <button
                                                onClick={() => markPrintAsPickedup(activeOrder?._id)}
                                                className='flex my-4 w-full items-center flex-center gap-1 bg-green-600 text-white text- py-2 text-base rounded-full justify-center active:scale-95'>
                                                <MdDone size={20} /> Mark Order as Picked Up
                                            </button>
                                        )}
                                    </section>)
                            ) : (
                                activeOrder?.orderStatus !== "Pending" && activeOrder?.orderStatus !== "Cancelled" && activeOrder?.orderStatus !== "Delivered" && (
                                    <section className="flex flex-col justify-between mb-6 py-2 px-4 rounded-lg bg-white shadow-lg border border-blue-500">
                                        <h2 className="bg-blue-600 text-gray-100 text-center mt-2 rounded-lg text-lg py-1 font-semibold">
                                            Order Status : {activeOrder?.orderStatus}
                                        </h2>
                                        <h2 className="bg-blue-800 text-white italic text-center text-base mt-2 rounded-lg py-1 font-semibold">
                                            Order ID : {activeOrder?._id}
                                        </h2>
                                        <h2 className="bg-blue-800 text-white italic text-center text-base mt-2 rounded-lg py-1 font-semibold">
                                            {activeOrder?.shopId?.shopName || "Not Found"}
                                        </h2>
                                        <p className="italic mt-2">
                                            Your order of
                                        </p>
                                        <ol className="list-disc ml-6">
                                            {activeOrder?.productDetails?.map((item) => {
                                                return <li className="font-semibold italic">{item?.totalPrice / item?.item?.price} x {item?.item?.productName}</li>
                                            })}
                                        </ol>
                                        <p className="italic mt-2">
                                            is placed successfully.
                                        </p>
                                        <p className="italic mt-2">
                                            Please contact {activeOrder?.deliveryPersonId?.name} for more details.
                                        </p>
                                        <p><b>Added comments:</b> {activeOrder?.comments || "None"}</p>
                                        <div className="flex items-center justify-between px-3 w-full mt-3 h-fit py-2 rounded-xl bg-blue-100">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-red-400 text-white p-1 text-lg rounded-full h-10 w-10 flex items-center justify-center">{activeOrder?.deliveryPersonId?.name[0]}</span>
                                                <span>
                                                    <p className="text-lg font-semibold">{activeOrder?.deliveryPersonId?.name}</p>
                                                    <p className="text-sm">SID: {activeOrder?.deliveryPersonId?.sid}</p>
                                                </span>
                                            </div>
                                            <span>
                                                <MdCall onClick={() => {
                                                    alert(`Call : ${activeOrder?.deliveryPersonId?.phone}`)
                                                }} size={22} className="mr-2" />
                                            </span>
                                        </div>
                                        {activeOrder?.orderStatus === "Out for Delivery" && (
                                            <span className='w-full text-sm mt-3 text-center'>
                                                Your order is Out For Delivery. Kindly share the below OTP with {activeOrder?.deliveryPersonId?.name} to accept the order.
                                                <div className='text-lg bg-blue-600 text-white mt-2 rounded-lg'>OTP : {activeOrder?.otp}</div>
                                            </span>
                                        )}
                                    </section>
                                )
                            )
                        })}
                        {activeTab === 'placed' && placedOrders.length === 0 && <p className='text-center'>No Active Placed Orders</p>}

                        {/* Active Delivery Orders */}

                        {activeTab === 'delivery' && deliveryOrders && (deliveryOrders?.map((orderForDelivery) => {
                            return (
                                <section className="w-full px-4 py-2 mb-8 bg-white border border-black shadow h-fit rounded-lg">
                                    <h2 className="bg-black text-white text-center mt-2 rounded-lg text-lg py-1 font-semibold">
                                        Active Order for {orderForDelivery?.userId?.name?.split(" ", 2)[0]}
                                    </h2>
                                    <p className="mt-2"><b>Name:</b> {orderForDelivery?.userId?.name}</p>
                                    <p><b>Order ID:</b> {orderForDelivery?._id}</p>
                                    <p><b>Details:</b></p>
                                    <ol className="list-disc ml-6 w-fit pr-3 bg-gray-100 pl-6 py-2 rounded-2xl">
                                        {orderForDelivery?.productDetails?.map((item) => {
                                            return <li className="font-semibold italic">{item?.totalPrice / item?.item?.price} x {item?.item?.productName}</li>
                                        })}
                                    </ol>
                                    <p><b>Address:</b> {orderForDelivery?.userId?.address}</p>
                                    <p><b>User Contact:</b> {orderForDelivery?.userId?.phone}</p>
                                    <p><b>Status:</b> {orderForDelivery?.orderStatus === 'Accepted' ? 'Preparing' : orderForDelivery?.orderStatus}</p>
                                    <p className="italic mt-2">
                                        Please contact {orderForDelivery?.userId?.name} for more details.
                                    </p>
                                    <div className="flex items-center justify-between px-3 w-full mt-3 h-fit py-2 rounded-xl bg-blue-100">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-red-400 text-white p-1 text-lg rounded-full h-10 w-10 flex items-center justify-center">{orderForDelivery?.userId?.name[0]}</span>
                                            <span>
                                                <p className="text-lg font-semibold">{orderForDelivery?.userId?.name}</p>
                                                <p className="text-sm">SID: {orderForDelivery?.userId?.sid}</p>
                                            </span>
                                        </div>
                                        <span>
                                            <MdCall onClick={() => {
                                                alert(`Call : ${orderForDelivery?.userId?.phone || "Not Found"}`)
                                            }} size={22} className="mr-2" />
                                        </span>
                                    </div>
                                    {orderForDelivery?.orderStatus === "Completed" && <button
                                        onClick={() => markAsPickedup(orderForDelivery?._id)
                                        }
                                        className='flex my-4 w-full items-center flex-center gap-1 bg-green-600 text-white text- py-2 text-base rounded-full justify-center active:scale-95'>
                                        <MdDone size={20} /> Mark Order as Picked Up
                                    </button>}
                                    {orderForDelivery?.orderStatus === "Out for Delivery" && (
                                        <div className="text-center mt-4">
                                            <div className="flex justify-center space-x-2 mb-2">
                                                {[...Array(4)].map((_, index) => (
                                                    <input
                                                        key={index}
                                                        type="text"
                                                        maxLength="1"
                                                        className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (value.length === 1) {
                                                                const nextInput = e.target.nextElementSibling;
                                                                if (nextInput) {
                                                                    nextInput.focus();
                                                                }
                                                            }
                                                            setOtpCode((prev) => {
                                                                const newOtp = prev.split('');
                                                                newOtp[index] = value;
                                                                return newOtp.join('');
                                                            });
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <div className='flex items-center justify-center mb-4'>
                                                {error && <ErrorPop text={error} />}
                                            </div>
                                            {otpCode?.length === 4 ? <button onClick={() => submitOTP(orderForDelivery?._id)} className="bg-black mb-2 text-white px-4 py-2 rounded-md active:scale-95">Submit</button> : <button disabled onSubmit={() => submitOTP(orderForDelivery?._id)} className="bg-black mb-2 text-white px-4 py-2 rounded-md disabled:opacity-40">Submit</button>}
                                        </div>
                                    )}
                                </section>
                            )
                        })
                        )}
                        {activeTab === 'delivery' && !deliveryOrders.length && <p className='text-center text-sm'>No Active Orders for Delivery. Enable <b>'Earn Coins'</b> Option to get LIVE order update when someone requires a delivery!</p>}

                        {/* Past Orders */}
                        {activeTab === 'past' && (
                            placedOrders?.map((activeOrder) => {
                                return activeOrder?.pdfLink ? (
                                    activeOrder?.orderStatus !== "Pending" && activeOrder?.orderStatus !== "Accepted" && activeOrder?.orderStatus !== "Completed" && activeOrder?.orderStatus !== "Out for Delivery" && (
                                        <section className="flex flex-col justify-between mb-6 py-2 px-4 rounded-lg bg-white shadow-lg border border-black">
                                            <h2 className={activeOrder?.orderStatus === "Cancelled" ? "bg-red-600 text-gray-100 text-center mt-2 rounded-lg text-lg py-1 font-semibold" : activeOrder?.orderStatus === "Delivered" ? "bg-green-600 text-gray-100 text-center mt-2 rounded-lg text-lg py-1 font-semibold" : "bg-blue-600 text-gray-100 text-center mt-2 rounded-lg text-lg py-1 font-semibold"}>
                                                Order Status : {activeOrder?.orderStatus}
                                            </h2>
                                            <p className="italic mt-2">
                                                Order Details:
                                            </p>
                                            <p>
                                                <b>Print Link:</b>
                                                <a href={activeOrder.pdfLink} target="_blank" rel="noreferrer" className="text-blue-600 flex w-full text-wrap underline break-all">
                                                    {activeOrder.pdfLink}
                                                </a>
                                                <b>Vendor: </b>
                                                <i>{activeOrder?.shopId?.shopName}</i>
                                            </p>
                                            <p className="italic mt-2">
                                                Date:&nbsp;
                                                {new Date(activeOrder?.updatedAt).toLocaleString("en-US", {
                                                    dateStyle: "medium",
                                                    timeStyle: "short"
                                                })}
                                            </p>
                                        </section>
                                    )
                                ) : (
                                    activeOrder?.orderStatus !== "Pending" && activeOrder?.orderStatus !== "Accepted" && activeOrder?.orderStatus !== "Completed" && activeOrder?.orderStatus !== "Out for Delivery" && (
                                        <section className="flex flex-col justify-between mb-6 py-2 px-4 rounded-lg bg-white shadow-lg border border-black">
                                            <h2 className={activeOrder?.orderStatus === "Cancelled" ? "bg-red-600 text-gray-100 text-center mt-2 rounded-lg text-lg py-1 font-semibold" : activeOrder?.orderStatus === "Delivered" ? "bg-green-600 text-gray-100 text-center mt-2 rounded-lg text-lg py-1 font-semibold" : "bg-blue-600 text-gray-100 text-center mt-2 rounded-lg text-lg py-1 font-semibold"}>
                                                Order Status : {activeOrder?.orderStatus}
                                            </h2>
                                            <p className="italic mt-2">
                                                Order Details:
                                            </p>
                                            <ol className="list-disc ml-6">
                                                {activeOrder?.productDetails?.map((item) => {
                                                    return <li className="font-semibold italic">{item?.totalPrice / item?.item?.price} x {item?.item?.productName}</li>
                                                })}
                                            </ol>
                                            <p className="italic mt-2">
                                                Date:&nbsp;
                                                {new Date(activeOrder?.updatedAt).toLocaleString("en-US", {
                                                    dateStyle: "medium",
                                                    timeStyle: "short"
                                                })}
                                            </p>
                                        </section>
                                    )
                                )
                            })
                        )}
                        <div className='w-full h-10'></div>
                    </div>
                </CSSTransition>
            </TransitionGroup>
            <BottomNav />
            <style jsx>{`
        .fade-enter {
          opacity: 0;
          transform: translateY(-10px);
        }
        .fade-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 300ms, transform 300ms;
        }
        .fade-exit {
          opacity: 1;
          transform: translateY(0);
        }
        .fade-exit-active {
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 300ms, transform 300ms;
        }
      `}</style>
        </div>
    );
};

export default OrderPageNav;