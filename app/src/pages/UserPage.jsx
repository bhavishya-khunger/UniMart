import React from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import { Link } from "react-router-dom";
import OrderContainer from "../components/UserPage/OrderContainer";

const obj1 = {
  Burger: 1,
  "Mushroom Pizza (Large)": 2,
  Coke: 2,
};
const obj2 = {
  "Cheese Burger": 1,
  "Pineapple Pizza (Large)": 2,
  Coke: 2,
};

function UserPage() {
  return (
    <>
      <header className="bg-orange-300">
        <div className="ml-4">
          <MdOutlineArrowBack />
          <h1 className="text-xl font-bold ">Bhavishya Khunger</h1>
          <p>bhavishyakhunger.bt23ele@pec.edu.in</p>
          <p>
            <Link to="/userpage/profile">Edit</Link>
          </p>
        </div>
      </header>
      <main>
        <div className="flex flex-col items-center justify-start w-[100vw] mt-4 ">
          {/* Item container */}
          <OrderContainer
            restaurantName={"Gyoza cafe"}
            itemsList={obj1}
            netPrice={512}
          />
          <OrderContainer
            restaurantName={"Didi ki Dukaan"}
            itemsList={obj2}
            netPrice={416}
          />
        </div>
      </main>
    </>
  );
}

export default UserPage;
