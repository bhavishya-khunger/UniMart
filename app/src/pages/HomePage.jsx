import { useEffect, useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { BsToggles2 } from "react-icons/bs";
import { AiFillHome, AiOutlineUser, AiOutlineWallet } from "react-icons/ai";
import FoodItem from "../components/HomePage/FoodItem";
import Restaurant from "../components/HomePage/Restaurant";
import burgerImage from "../Images/HomePage/burger.png";
import axios from 'axios'
import { Link } from "react-router-dom";
import BottomNav from "../components/General/BottomNav";
import ErrorPop, { } from "../components/General/ErrorPop"

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
