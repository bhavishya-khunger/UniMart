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
import ErrorPop, {} from "../components/General/ErrorPop"

function App() {
  const [restaurants, setRestaurants] = useState([]);
  useEffect(() => {
    const getShops = async () => {
      const response = await axios.get(`${import.meta.env.VITE_SHOP_BASE_URL}/get-shops`);
      // console.log(response.data.users);
      setRestaurants(response.data.shops);
    }
    getShops();
  }, [])


  return (
    <>
      <div className="px-4 py-5 h-full">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8">
          <div className="heading">
            <h1 className="text-2xl font-bold pl-2">Explore Your Meals</h1>
            <h1 className="text-2xl font-bold pl-2">With UniMart!</h1>
          </div>
          <div className="text-2xl font-semibold flex justify-center items-center w-12 h-12 rounded-full border-2 ml-2 text-blue-600 border-black bg-blue-200">
            B
          </div>
        </header>

        {/* Search Bar Section */}
        {/* <div className="flex items-center justify-center mb-8">
          <section className="searchBar flex w-full max-w-xl justify-between items-center bg-gray-200 py-3 rounded-full px-4">
            <FaSearch className="text-xl text-gray-600" />
            <input
              type="text"
              className="bg-gray-200 w-full h-full outline-none text-gray-700 pl-2"
              placeholder="Search for meals or restaurants..."
            />
            <BsToggles2 className="text-xl text-gray-600" />
          </section>
        </div> */}

        {/* Cover Image Section */}
        <section className="coverImageContainer flex justify-center items-center relative mb-8">
          <img
            src="https://img.pikbest.com/templates/20240602/food-burger-restaurant-offer-web-banner-design_10587345.jpg!sw800"
            alt="burger"
            className="h-56 w-full max-w-xl rounded-3xl"
          />
        </section>

        {/* Food Items Slider */}
        {/* <section className="itemSlider flex gap-4 overflow-x-auto whitespace-nowrap scroll-smooth mb-8">
          <FoodItem foodName="Burger" foodImage={burgerImage} />
          <FoodItem foodName="Pizza" foodImage={burgerImage} />
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
      </div>
      <BottomNav />
    </>
  );
}

export default App;
