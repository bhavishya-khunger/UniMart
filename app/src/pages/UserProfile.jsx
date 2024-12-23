import React, { useState } from "react";
import InputVal from '../components/General/InputVal.jsx';
import Loading from '../components/General/Loading.jsx';
import ErrorPop from '../components/General/ErrorPop.jsx';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function UserProfile() {
  const currUser = JSON.parse(localStorage.getItem('user'));
  const [address, setAddress] = useState(currUser?.address);
  const [phone, setPhone] = useState(currUser?.phone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const saveProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_USER_BASE_URL}/edit`, {
        userId: currUser?._id,
        address,
        phone,
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate('/userpage');
    } catch (error) {
      console.log(error);
      setError("An error occurred while saving your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <header className="flex flex-col items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 40 40">
          <path fill="#F06225" d="M20 0c11.046 0 20 8.954 20 20v14a6 6 0 0 1-6 6H21v-8.774c0-2.002.122-4.076 1.172-5.78a10 10 0 0 1 6.904-4.627l.383-.062a.8.8 0 0 0 0-1.514l-.383-.062a10 10 0 0 1-8.257-8.257l-.062-.383a.8.8 0 0 0-1.514 0l-.062.383a9.999 9.999 0 0 1-4.627 6.904C12.85 18.878 10.776 19 8.774 19H.024C.547 8.419 9.29 0 20 0Z"></path>
          <path fill="#F06225" d="M0 21h8.774c2.002 0 4.076.122 5.78 1.172a10.02 10.02 0 0 1 3.274 3.274C18.878 27.15 19 29.224 19 31.226V40H6a6 6 0 0 1-6-6V21ZM40 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path>
        </svg>
        <h1 className="font-bold text-2xl mt-2 text-center mb-3">
          Edit Your Profile!
        </h1>
        <p className="px-8 text-center text-gray-500 text-sm">
          For now, you can only edit your Phone Number and Address.
        </p>
      </header>
      <main className="mt-6">
        <InputVal
          onChange={(e) => setPhone(e.target.value)}
          fieldVal={"Phone"}
          type={"number"}
          value={phone}
          disabled={false}
          max={10}
          min={10}
        />
        <InputVal
          onChange={(e) => setAddress(e.target.value)}
          fieldVal={"Address"}
          type={"text"}
          value={address}
          disabled={false}
        />
        <div className="flex justify-center">
          {loading && <Loading />}
          {error && <ErrorPop text={error} />}
        </div>
      </main>
      <footer className="flex flex-col mt-6">
        <button
          onClick={saveProfile}
          className="bg-[#FF4539] text-white text-xl px-6 py-3 font-bold rounded-full w-[80vw] mb-4 active:scale-95">
          Save
        </button>
      </footer>
    </div>
  );
}

export default UserProfile;