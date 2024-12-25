import React, { useState } from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import OrderContainer from "../components/UserPage/OrderContainer";
import BottomNav from "../components/General/BottomNav";
import { BiCoin, BiDownvote, BiLogOut, BiPencil } from "react-icons/bi";
import axios from 'axios';
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

function UserPage() {
  const currUser = JSON.parse(localStorage.getItem("user"));
  const [accepting, setAccepting] = useState(currUser?.agreesToDeliver || false);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  const acceptOrders = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_USER_BASE_URL}/accept-orders`, {
        userId: currUser?._id,
      });
      if (res.data.user) {
        const updatedUser = res.data.user;
        // Update localStorage and state with the new user data
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setAccepting(updatedUser.agreesToDeliver);
        console.log("User's delivery status updated successfully");
      }
    } catch (error) {
      console.error("Error updating delivery status:", error);
    }
  };

  const logoutUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_USER_BASE_URL}/logout`);
      console.log(res);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("expiryTime");
      return navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <header className="bg-orange-600 bg-cover border-b border-t border-black text-white py-4 px-4 flex flex-col justify-center">
        <div className="flex items-center w-full gap-4 py-2">
          <div className="bg-white rounded-full p-2 w-14 h-14 border text-2xl font-semibold flex items-center justify-center text-black">
            {currUser?.name?.[0] || "?"}
          </div>
          <div className="flex flex-col justify-center h-full">
            <h1 className="text-2xl font-semibold ">{currUser?.name || "Guest"}</h1>
            {
              currUser?.role === "Student" ? <p className="text-sm italic">Student ID: {currUser?.sid || "N/A"}</p> : ""
            }
            {
              currUser?.role === "Admin" ? <p className="text-sm italic">Admin Account</p> : ""
            }
            <p className="text-sm italic">{currUser?.email || "No email provided"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <p className="mt-4 flex bg-black w-fit px-3 py-2 rounded-full items-center gap-2">
            <BiPencil size={20} />
            <Link to="/userpage/profile">Edit</Link>
          </p>
          {currUser?.role === "Student" ?
            accepting ?
              <button onClick={acceptOrders} className="mt-4 flex bg-green-200 font-semibold text-green-700 w-fit px-3 py-2 rounded-full items-center gap-2 active:scale-95">
                <BiCoin size={22} />
                <label htmlFor="check">Earn Coins : ON</label>
              </button>
              :
              <button onClick={acceptOrders} className="mt-4 flex bg-black font-semibold text-white w-fit px-3 py-2 rounded-full items-center gap-2 active:scale-95">
                <BiCoin size={22} />
                <label htmlFor="check">Earn Coins : OFF</label>
              </button>
            :
            <div className="bg-black px-4 h-fit mt-4 py-2 rounded-full">Role : Shopkeeper</div>}
          <div onClick={() => setShowLogout(!showLogout)} className="mt-4 pl-6 flex items-center">
            {!showLogout ? <FaAngleDown /> : <FaAngleUp />}
          </div>
        </div>
        {showLogout && (
          <button onClick={logoutUser} className="bg-black w-fit flex gap-2 py-2 mt-3 rounded-full px-3 active:scale-95">
            <BiLogOut size={22} /> LogOut
          </button>
        )}
      </header>
      <main>
        <div className="flex flex-col items-center justify-start w-[100vw] mt-4 ">
          {/* Item container */}
          To be made
        </div>
      </main>
      <BottomNav />
    </>
  );
}

export default UserPage;
