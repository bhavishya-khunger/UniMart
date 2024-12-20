import React from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import { Link } from "react-router-dom";
import OrderContainer from "../components/UserPage/OrderContainer";
import BottomNav from "../components/General/BottomNav";
import { BiPencil } from "react-icons/bi";

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
      <header className="bg-orange-600 text-white py-4 px-4 flex flex-col justify-center">
        <div className="flex items-center w-full gap-4 py-2">
          <div className="bg-white rounded-full p-2 w-12 h-12 text-2xl font-semibold flex items-center justify-center text-black">
            B
          </div>
          <div className="flex flex-col justify-center h-full">
            <h1 className="text-xl font-semibold ">Bhavishya Khunger</h1>
            <p className="text-sm italic">bhavishyakhunger.bt23ele@pec.edu.in</p>
          </div>
        </div>
        <p className="mt-4 flex bg-black w-fit px-3 py-2 rounded-full items-center gap-2">
          <BiPencil size={20} />
          <Link to="/userpage/profile">Edit</Link>
        </p>
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
      <BottomNav />
    </>
  );
}

export default UserPage;
