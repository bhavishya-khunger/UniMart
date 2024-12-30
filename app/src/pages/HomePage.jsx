import { useContext, useEffect, useState } from "react";
import Restaurant from "../components/HomePage/Restaurant";
import axios from 'axios'
import BottomNav from "../components/General/BottomNav";
import ErrorPop from "../components/General/ErrorPop"
import { SocketContext } from '../context/SocketContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import ShopLiveOrder from "../components/HomePage/ShopLiveOrder.jsx";
import { UserDataContext } from '../context/UserContext.jsx'
import printingPhoto from '../assets/printer.avif'

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [shopOrders, setShopOrders] = useState([]);

  const { user, setUser } = useContext(UserDataContext);

  useEffect(() => {
    if (user?.role === 'Admin') return navigate('/admininsights');
  }, [user]);

  const sortOrders = (orders) => {
    return [...orders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  const getShopOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_USER_BASE_URL}/orders/${user?._id}`);
      setShopOrders(sortOrders(res.data.orders));
      console.log((res.data.orders));
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const getShops = async () => {
      const response = await axios.get(`${import.meta.env.VITE_SHOP_BASE_URL}/get-shops`);
      setRestaurants(response.data.shops);
    }
    getShops();
    getShopOrders();
  }, []);

  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("join", { userId: user._id });
    socket.on("order-accepted", () => {
      if (user?.role === "Shopkeeper") {
        getShopOrders();
        navigate('/');
      }
    })
  }, [user]);
  return (
    <>
      {/* Decorations */}
      <img className="absolute h-54 w-full object-contain top-0 rounded-b-xl opacity-100 -z-10" src={"https://media.istockphoto.com/id/1190059388/vector/white-splash-on-blue-background-forest-during-a-snow-storm-at-night-christmas-tree.jpg?s=612x612&w=0&k=20&c=6ihDcTPbePYGPhRWt458eQPKvC8kWn2Dv4BR2lTdZTI="} alt="" />
      {/* <img className="absolute h-54 w-full object-contain top-0 rounded-b-xl opacity-30 -z-10" src={confetti} alt="" /> */}
      {/* show this to student, hidden for ADMIN and SHOPKEEPER */}
      <div className={user.role !== "Student" ? "hidden" : "px-4 py-5 h-full"}>
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8">
          <div className="heading">
            <h1 className="text-2xl text-white font-bold pl-2">Explore Your Meals</h1>
            <h1 className="text-3xl text-white font-bold pl-2">With UniMart!</h1>
          </div>
          <div className="text-2xl font-semibold flex justify-center items-center w-12 h-12 rounded-full border-2 ml-2 text-blue-600 border-black bg-blue-200">
            {user?.name[0]}
          </div>
        </header>

        {/* Cover Image Section */}
        <section className="coverImageContainer flex justify-center items-center relative mb-8">
          <img
            src="https://www.shutterstock.com/image-vector/delicious-homemade-burger-splashing-cola-600nw-1805776183.jpg"
            alt="burger"
            className="h-56 w-full border shadow-lg shadow-white max-w-xl rounded-3xl"
          />
        </section>

        {/* Print on Demand */}
        <Link to={'/pdf'} className="overflow-hidden flex px-3 pr-2 justify-between items-center relative mb-6 transition-colors bg-[#292420] text-white h-28 border-2 border-gray-100 rounded-xl py-2 shadow-md shadow-gray-400 active:scale-95">
          <span className="flex flex-col text-left">
            <h1 className="text-sm text-yellow-500 font-semibold italic ">Introducing</h1>
            <h1 className="text-2xl text-yellow-400 italic font-bold">Print on Demand</h1>
            <h1 className="text-sm text-yellow-500 font-semibold italic">Choose, Upload, Submit, Collect!</h1>
          </span>
          <img className="h-28" src={printingPhoto} alt="" />
        </Link>

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
            <h1 className="text-2xl text-white font-bold pl-2">Explore Your Orders</h1>
            <h1 className="text-2xl text-white font-bold pl-2">With UniMart!</h1>
          </div>
          <div className="text-2xl font-semibold flex justify-center items-center w-12 h-12 rounded-full border-2 ml-2 text-blue-600 border-black bg-blue-200">
            {user?.name[0]}
          </div>
        </header>

        {/* Cover Image Section */}
        <section className="coverImageContainer flex justify-center items-center relative mb-8">
          <img
            src="https://www.shutterstock.com/image-vector/delicious-homemade-burger-splashing-cola-600nw-1805776183.jpg"
            alt="burger"
            className="h-56 shadow-lg shadow-white border w-full max-w-xl rounded-3xl"
          />
        </section>

        {/* Live Order Section */}
        <section className="flex justify-between items-center mb-2 py-2 rounded-lg">
          <h2 className="text-xl font-semibold">{"Live Orders"}</h2>
        </section>
        <div className="w-full text-white flex justify-evenly text-sm">
          <span className="bg-green-600 py-1 px-3 rounded-lg">
            Marked For Delivery
          </span>
          <span className="bg-orange-600 py-1 px-3 rounded-lg">
            To be delivered
          </span>
        </div>
        <div className="w-full">
          <div className="max-w-7xl mx-auto p-4">
            {shopOrders?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ShopLiveOrder sortedOrders={shopOrders} user={user} />
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
