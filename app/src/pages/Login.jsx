import React, { useContext, useState } from "react";
import InputVal from "../components/General/InputVal";
import { Link, useNavigate } from "react-router-dom";
import ErrorPop from "../components/General/ErrorPop";
import axios from "axios";
import Loading from "../components/General/Loading";
import { UserDataContext } from "../context/UserContext";

const Login = () => {
  const {user, setUser} = useContext(UserDataContext);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!credential || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);

      const endpoint = `${import.meta.env.VITE_USER_BASE_URL}/login`;
      const res = await axios.post(endpoint, { credential, password });
      // Handle success (e.g., save token, redirect)
      if (res.status === 200) {
        // console.log(res);


        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user)); // change this with context
        const time = new Date().getTime() + 1000 * 20 * 60; //20min
        localStorage.setItem('expiryTime', time);
        return navigate("/")
      };
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred during login.");
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
          Welcome to UniMart!
        </h1>
        <p className="text-center text-sm text-gray-600 text-wrap px-12">
          We are happy to welcome you! Kindly fill the required details
        </p>
      </header>
      <main className="mt-6">
        <InputVal
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          fieldVal={"SID/Email"}
          type={"text"}
        />
        <InputVal
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fieldVal={"Password"}
          type={"password"}
        />
        <div className="flex justify-center">
          {loading && <Loading />}
          {error && <ErrorPop text={error} />}
        </div>
      </main>
      <footer className="flex flex-col mt-6">
        <button
          onClick={loginHandler}
          className="bg-[#FF4539] text-white text-xl px-6 py-3 font-bold rounded-full w-[80vw] mb-4 active:scale-95">
          Sign in
        </button>
        <p className="text-center">
          Not registered yet? Click
          <Link
            to="/register"
            className="text-center text-[#FF4539] cursor-pointer font-bold ml-1">
            here
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default Login;
