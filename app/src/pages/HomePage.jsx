import { useContext, useEffect, useState } from "react";
import Restaurant from "../components/HomePage/Restaurant";
import axios from 'axios'
import BottomNav from "../components/General/BottomNav";
import ErrorPop from "../components/General/ErrorPop"
import { MdCall } from "react-icons/md";
import { SocketContext } from '../context/SocketContext.jsx';

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [activeOrder, setActiveOrder] = useState({});

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
  }, [activeOrder?.orderStatus]);
  const user = JSON.parse(localStorage.getItem('user'));

  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket.emit("join", { userId: user._id });
  }, [user]);
  console.log(activeOrder);
  return (
    <>
      <div className={user.role === "Shopkeeper" ? "hidden" : "px-4 py-5 h-full"}>
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
                return <li className="font-semibold italic">{item?.totalPrice/item?.item?.price} x {item?.item?.productName}</li>
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
                <MdCall size={22} className="mr-2" />
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
      <div className={user.role === "Student" ? "hidden" : "px-4 py-5 h-full"}>
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

        {/* Recommended Section */}
        <section className="flex justify-between items-center mb-6 py-2 rounded-lg">
          <h2 className="text-xl font-semibold">{"Live Orders"}</h2>
        </section>
        <div className="w-full h-20">
        </div>
        <BottomNav />
      </div>
    </>
  );
}

export default App;
