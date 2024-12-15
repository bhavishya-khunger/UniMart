import React from "react";
import InputVal from "../components/InputVal";
import { Link } from "react-router-dom";

function Login() {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <header className="flex flex-col items-center justify-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/225px-Instagram_logo_2022.svg.png"
            alt="istg"
            className="w-20 h-20 m-7"
          />
          <h1 className="font-bold text-2xl text-center mb-4">
            Welcome to UniMart!
          </h1>
          <p className="text-center text-gray-600 text-wrap mb-7 text-base">
            We are happy to welcome you! Kindly fill the required details
          </p>
        </header>
        <main>
          <InputVal fieldVal={"E-mail"} type={"email"} />
          <InputVal fieldVal={"Password"} type={"password"} />
        </main>
        <footer className="flex flex-col mt-8">
          <button className="bg-[#FF4539] text-white text-xl px-6 py-3 font-bold rounded-full w-[80vw] mb-4">
            Sign in
          </button>
          <div className="flex items-center mb-4"></div>
          <p>Not registered yet, Click <Link to="/register" className="text-center text-[#FF4539] cursor-pointer font-bold ml-1">here</Link> to register</p>
        </footer>
      </div>
    </>
  );
}

export default Login;
