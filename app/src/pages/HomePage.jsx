import { useContext, useEffect, useState } from "react";
import Restaurant from "../components/HomePage/Restaurant";
import axios from 'axios'
import BottomNav from "../components/General/BottomNav";
import ErrorPop from "../components/General/ErrorPop"
import { MdCall } from "react-icons/md";
import { SocketContext } from '../context/SocketContext.jsx';
import { useNavigate } from 'react-router-dom';

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [activeOrder, setActiveOrder] = useState({});
  const [shopOrders, setShopOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const orderForDelivery = JSON.parse(localStorage.getItem('order-for-delivery'));

  useEffect(() => {
    if (user?.role === 'Admin') return navigate('/admininsights');
  }, [user]);

  useEffect(() => {
    const getShops = async () => {
      const response = await axios.get(`${import.meta.env.VITE_SHOP_BASE_URL}/get-shops`);
      // console.log(response.data.users);
      setRestaurants(response.data.shops);
    }
    getShops();
    const getOrderDetails = async () => {
      const response = await axios.get(`${import.meta.env.VITE_CART_BASE_URL}/order/${JSON.parse(localStorage.getItem('user'))._id}`);
      if (response.data.order) {
        setActiveOrder(response.data.order[response.data.order.length - 1]);
        console.log(response.data.order);
      }
    }
    getOrderDetails();
    const getShopOrders = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_USER_BASE_URL}/orders/${user?._id}`);
        setShopOrders(res.data.orders);
        console.log(res.data.orders);
      } catch (error) {
        console.log(error)
      }
    }
    getShopOrders();
  }, [activeOrder?.orderStatus]);

  const sortedOrders = [...shopOrders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("join", { userId: user._id });
    socket.on("order-accepted", () => {
      if (user?.role === "Shopkeeper") {
        console.log("Order aaya hai!!");
        navigate('/');
      }
    })
  }, [user]);
  console.log(activeOrder);
  return (
    <>
      {/* show this to student, hidden for ADMIN and SHOPKEEPER */}
      <div className={user.role !== "Student" ? "hidden" : "px-4 py-5 h-full"}>
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8">
          <div className="heading">
            <h1 className="text-2xl font-bold pl-2">Explore Your Meals</h1>
            <h1 className="text-2xl font-bold pl-2">With UniMart!</h1>
          </div>
          <div className="text-2xl font-semibold flex justify-center items-center w-12 h-12 rounded-full border-2 ml-2 text-blue-600 border-black bg-blue-200">
            {user?.name[0]}
          </div>
        </header>

        {/* Cover Image Section */}
        <section className="coverImageContainer flex justify-center items-center relative mb-8">
          <img
            src="https://img.pikbest.com/templates/20240602/food-burger-restaurant-offer-web-banner-design_10587345.jpg!sw800"
            alt="burger"
            className="h-56 w-full max-w-xl rounded-3xl"
          />
        </section>

        {/* Order for delivery Section */}
        {orderForDelivery &&
          <section className="w-full px-4 py-2 mb-8 bg-white border border-black shadow h-fit rounded-lg">
            <h2 className="bg-black text-white text-center mt-2 rounded-lg text-lg py-1 font-semibold">
              Active Order for Delivery
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
          </section>
        }

        {/* Current Order Section */}
        {(activeOrder && activeOrder?.orderStatus !== 'Pending' && activeOrder?.orderStatus !== 'Delivered') && (
          <section className="flex flex-col justify-between mb-6 py-2 px-4 rounded-lg bg-white shadow-lg border">
            <h2 className="bg-gray-100 text-center mt-2 rounded-lg text-lg py-1 font-semibold">
              Order : {activeOrder?.orderStatus}
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
          </section>
        )}

        {/* Recommended Section */}
        <section className="flex justify-between items-center mb-6 py-2 rounded-lg">
          <h2 className="text-xl font-semibold">{!restaurants ? "" : "Recommended For You"}</h2>
        </section>

        {/* Restaurants List */}
        <section className="restaurantList flex flex-col items-center justify-center gap-6">
          {restaurants.length == 0 && (
            <ErrorPop text={"No Restaurants Found in your Area!"} />
          )}
          {restaurants && restaurants.map((restaurant) => {
            return (
              <Restaurant
                key={restaurant._id}
                restaurantId={restaurant._id}
                restaurantImage={restaurant.shopImage}
                restaurantName={restaurant.shopName}
                rating={4.4}
              />
            )
          })}
        </section>
        <div className="w-full h-20">
        </div>
        <BottomNav />
      </div>
      {/* show this to shopkeeper, hidden for ADMIN and STUDENT */}
      <div className={user.role !== "Shopkeeper" ? "hidden" : "px-4 py-5 h-full"}>
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8">
          <div className="heading">
            <h1 className="text-2xl font-bold pl-2">Explore Your Orders</h1>
            <h1 className="text-2xl font-bold pl-2">With UniMart!</h1>
          </div>
          <div className="text-2xl font-semibold flex justify-center items-center w-12 h-12 rounded-full border-2 ml-2 text-blue-600 border-black bg-blue-200">
            {user?.name[0]}
          </div>
        </header>

        {/* Cover Image Section */}
        <section className="coverImageContainer flex justify-center items-center relative mb-8">
          <img
            src="https://img.pikbest.com/templates/20240602/food-burger-restaurant-offer-web-banner-design_10587345.jpg!sw800"
            alt="burger"
            className="h-56 w-full max-w-xl rounded-3xl"
          />
        </section>

        {/* Live Order Section */}
        <section className="flex justify-between items-center mb-6 py-2 rounded-lg">
          <h2 className="text-xl font-semibold">{"Live Orders"}</h2>
        </section>
        <div className="w-full">







          <div className="max-w-7xl mx-auto p-4">
            {sortedOrders.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedOrders.map((order) => {
                  // Filter items for the current shopkeeper
                  const filteredItems = order.productDetails.filter(
                    (product) => product.item.shopkeeperId === user._id
                  );

                  // Skip rendering if no matching items
                  if (filteredItems.length === 0) return null;

                  return (
                    <div
                      key={order._id}
                      className="border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition duration-200"
                    >
                      {/* Header */}
                      <div className="bg-gray-100 p-4 rounded-t-lg">
                        <h5 className="text-lg font-semibold">Order ID: {order._id}</h5>
                        <p className="mt-1 text-sm text-gray-600">
                          Status:{" "}
                          <span className="text-green-600 font-medium">
                            {order.orderStatus}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Prepayment:{" "}
                          <span
                            className={`font-medium ${order.prePayment ? "text-green-600" : "text-red-600"
                              }`}
                          >
                            {order.prePayment ? "Yes" : "No"}
                          </span>
                        </p>
                      </div>

                      {/* Products Section */}
                      <div className="p-4">
                        <h6 className="text-md font-medium mb-2">Products:</h6>
                        <ul className="space-y-2">
                          {filteredItems.map((product, index) => (
                            <li
                              key={index}
                              className="flex items-center space-x-4 text-sm text-gray-700"
                            >
                              <img
                                src={product.item.productImg}
                                alt={product.item.productName}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium">{product.item.productName}</p>
                                <p className="text-xs text-gray-500">
                                  {product.item.desc}
                                </p>
                              </div>
                              <div>
                                <p>Qty: {product.totalPrice / product.item.price}</p>
                                <p>₹{product.totalPrice}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Footer */}
                      <div className="bg-gray-50 p-4 rounded-b-lg text-sm">
                        <p className="mb-1">
                          Delivery Person:{" "}
                          <span className="font-medium text-gray-800">
                            {order.deliveryPersonId?.name || "N/A"}
                          </span>
                        </p>
                        <p>
                          Contact:{" "}
                          <span className="font-medium text-gray-800">
                            {order.deliveryPersonId?.email || "N/A"}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Created At:{" "}
                          {new Date(order.createdAt).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500">No orders available.</p>
            )}
          </div>









        </div>
        <div className="h-20 w-full"></div>
        <BottomNav />
      </div>
    </>
  );
}

export default App;
