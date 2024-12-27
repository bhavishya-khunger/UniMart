import React, { useState } from "react";
import InputVal from "../components/General/InputVal";
import { Link, useNavigate } from "react-router-dom";
import ErrorPop from "../components/General/ErrorPop";
import axios from "axios";
import Loading from "../components/General/Loading";

const Register = () => {
  const [isShopkeeper, setIsShopkeeper] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sid, setSID] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [referalCode, setReferalCode] = useState("");

  const navigate = useNavigate();

  const handleCheckboxChange = () => setIsShopkeeper((prev) => !prev);

  const registerHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !email || !name) {
      setError("All fields are required.");
      return;
    }

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    if (!isValidEmail(email)) {
      setError("Email entered is invalid.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!isShopkeeper && (!sid || sid.length !== 8)) {
      setError("SID entered is invalid.");
      return;
    }

    try {
      setLoading(true);
      const userPayload = isShopkeeper
        ? { email, password, name, role: "Shopkeeper", referalCode }
        : { email, password, sid, name, role: "Student", referalCode };

      console.log("User Payload:", userPayload); // Log the payload to verify its contents

      const endpoint = `${import.meta.env.VITE_USER_BASE_URL}/register`;
      const res = await axios.post(endpoint, userPayload);
      console.log("Response:", res); // Log the response to verify the server's response

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      const time = new Date().getTime() + 1000 * 20 * 60; // 20min
      localStorage.setItem('expiryTime', time);

      // Redirect on success
      navigate("/");
    } catch (error) {
      console.log("Error Response:", error?.response); // Log the error response to debug the issue
      setError(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <header className="flex flex-col items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 40 40">
          <path fill="#F06225" d="M20 0c11.046 0 20 8.954 20 20v14a6 6 0 0 1-6 6H21v-8.774c0-2.002.122-4.076 1.172-5.78a10 10 0 0 1 6.904-4.627l.383-.062a.8.8 0 0 0 0-1.514l-.383-.062a10 10 0 0 1-8.257-8.257l-.062-.383a.8.8 0 0 0-1.514 0l-.062.383a9.999 9.999 0 0 1-4.627 6.904C12.85 18.878 10.776 19 8.774 19H.024C.547 8.419 9.29 0 20 0Z"></path>
          <path fill="#F06225" d="M0 21h8.774c2.002 0 4.076.122 5.78 1.172a10.02 10.02 0 0 1 3.274 3.274C18.878 27.15 19 29.224 19 31.226V40H6a6 6 0 0 1-6-6V21ZM40 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path>
        </svg>
        <h1 className="font-bold mt-2 text-2xl text-center mb-8">Welcome to UniMart!</h1>
      </header>
      <main>
        <InputVal value={name} onChange={(e) => setName(e.target.value)} fieldVal="Name" type="text" />
        {isShopkeeper ? ("") : (
          <InputVal value={sid} onChange={(e) => setSID(e.target.value)} fieldVal="SID" type="text" />
        )}
        <InputVal value={email} onChange={(e) => setEmail(e.target.value)} fieldVal="Email ID" type="email" />
        <InputVal value={password} onChange={(e) => setPassword(e.target.value)} fieldVal="Password" type="password" />
        <InputVal value={referalCode} onChange={(e) => setReferalCode(e.target.value)} fieldVal="Referral Code (optional)" type="text" />
        <div className="flex flex-col items-center justify-center w-[80vw]">
          {loading && <Loading />}
          {error && <ErrorPop text={error} />}
        </div>
      </main>
      <footer className="flex flex-col mt-6">
        <button
          onClick={registerHandler}
          className="bg-[#FF4539] text-white text-xl px-6 py-3 font-semibold rounded-full w-[80vw] mb-4 active:scale-95">
          Sign Up
        </button>
        <div className="flex self-center items-center mb-4">
          <input
            type="checkbox"
            id="shopkeeper"
            className="mr-2"
            checked={isShopkeeper}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="shopkeeper" className="self-center text-gray-700">Register as a Shopkeeper</label>
        </div>
        <p className="self-center">
          Already registered? Click
          <Link to="/login" className="text-center text-[#FF4539] cursor-pointer font-bold ml-1">here</Link>
        </p>
      </footer>
    </div>
  );
};

export default Register;
