import { useState } from "react";
import { FaBell } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { BsToggles2 } from "react-icons/bs";
// import FoodItem from "../components/HomePage/FoodItem";
import Restaurant from "../components/HomePage/Restaurant";


function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="mainContainer">
        <header className="flex b justify-between items-center mb-6">
          <div className="heading">
            <h1 className="text-2xl font-bold pl-2">Order your favourite</h1>
            <h1 className="text-2xl font-bold pl-2">Fast Food!</h1>
          </div>
          <div className="icon flex justify-center items-center w-12 h-12 rounded-full border-2 border-gray-700 bg-gray-200 mr-4">
            <FaBell className="text-orange-500 text-2xl" />
          </div>
        </header>

        <div className="flex items-center justify-center mb-6">
          <section className="searchBar flex w-[90vw] justify-between items-center bg-gray-200 py-3 rounded-full px-4">
            <FaSearch className="text-2xl" />
            <input type="text" name="" id="" className="bg-gray-200 h-[100%]" />
            <BsToggles2 />
          </section>
        </div>

        <section className="coverImageContainer flex justify-center items-center relative mb-6">
          <img
            src="https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyfGVufDB8fDB8fHww"
            alt="burger"
            className="h-44 w-[90vw] rounded-3xl"
          />
          <button className="absolute bottom-4 left-8 bg-gray-2000 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            Order now
          </button>
        </section>

        <section className="itemSlider flex gap-4 overflow-x-auto whitespace-nowrap scroll-smooth mb-6">
          {/* <FoodItem foodName="Burger" foodImage={burgerImage}/>
          <FoodItem foodName="Burger" foodImage={burgerImage}/>
          <FoodItem foodName="Burger" foodImage={burgerImage}/>
          <FoodItem foodName="Burger" foodImage={burgerImage}/>
          <FoodItem foodName="Burger" foodImage={burgerImage}/>
          <FoodItem foodName="Burger" foodImage={burgerImage}/>
          <FoodItem foodName="Burger" foodImage={burgerImage}/> */}
        </section>

        <section className="restaurantHeading bg-gray-200 flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold ml-3">Recommended for you</h2>
          <p>
            <a href="" className="mr-3">See all</a>
          </p>
        </section>

        <section className="restaurantList flex flex-col items-center justify-center">
        <Restaurant restaurantImage={"https://imgs.search.brave.com/AFxK2_4jpgXh9mwsjV_1phV7KBh-a_zW_eToLmcwDio/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/Z3JpZC5mb3Rvc2Vh/cmNoLmNvbS9JR1Mv/SUdTMDk4L2J1cmdl/ci1zdG9jay1pbWFn/ZV9faXMwOWE2ZnUz/LmpwZw"} restaurantName="Billu"/>
        <Restaurant restaurantImage={"https://imgs.search.brave.com/AFxK2_4jpgXh9mwsjV_1phV7KBh-a_zW_eToLmcwDio/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/Z3JpZC5mb3Rvc2Vh/cmNoLmNvbS9JR1Mv/SUdTMDk4L2J1cmdl/ci1zdG9jay1pbWFn/ZV9faXMwOWE2ZnUz/LmpwZw"} restaurantName="Billu"/>
        <Restaurant restaurantImage={"https://imgs.search.brave.com/AFxK2_4jpgXh9mwsjV_1phV7KBh-a_zW_eToLmcwDio/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/Z3JpZC5mb3Rvc2Vh/cmNoLmNvbS9JR1Mv/SUdTMDk4L2J1cmdl/ci1zdG9jay1pbWFn/ZV9faXMwOWE2ZnUz/LmpwZw"} restaurantName="Billu"/>
        </section>
      </div>
    </>
  );
}

export default App;