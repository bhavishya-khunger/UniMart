import { useEffect, useState } from "react";
import Restaurant from "../components/HomePage/Restaurant";
import axios from 'axios'
import BottomNav from "../components/General/BottomNav";
import ErrorPop from "../components/General/ErrorPop"
import { MdCall } from "react-icons/md";

function App() {
  const [restaurants, setRestaurants] = useState([]);
  useEffect(() => {
    const getShops = async () => {
      const response = await axios.get(`${import.meta.env.VITE_SHOP_BASE_URL}/get-shops`);
      // console.log(response.data.users);
      setRestaurants(response.data.shops);
    }
    getShops();
  }, []);
  const user = JSON.parse(localStorage.getItem('user'));


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
        {/* <section className="flex flex-col justify-between mb-6 py-2 px-4 rounded-lg bg-white shadow-lg border">
          <h2 className="bg-gray-100 text-center mt-2 rounded-lg text-lg py-1 font-semibold">Live Order Tracking</h2>
          <p className="italic mt-2">Your order from <b>Gyoza Cafe</b> of <b>Cheese Burger</b> will be delivered by 3:45pm (40 minutes from the order time)</p>
          <div className="flex items-center justify-between px-3 w-full mt-3 h-fit py-2 rounded-xl bg-blue-100">
            <div className="flex items-center gap-3">
              <span className="bg-red-400 text-white p-1 text-lg rounded-full h-10 w-10 flex items-center justify-center">B</span>
              <span>
                <p className="text-lg font-semibold">Bhavishya Khunger</p>
                <p className="text-sm">SID: 23104071</p>
              </span>
            </div>
            <span>
              <MdCall size={22} className="mr-2" />
            </span>
          </div>
        </section> */}

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
