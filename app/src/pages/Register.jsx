import React, { useState } from "react";
import InputVal from "../components/InputVal";

const Register = () => {
  
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
          <InputVal fieldVal={"Name"} type={"text"} />
          <InputVal fieldVal={"SID"} type={"text"} />
          <InputVal fieldVal={"E-mail"} type={"email"} />
          <InputVal fieldVal={"Password"} type={"password"} />
        </main>
        <footer className="flex flex-col mt-8">
          <button className="bg-[#FF4539] text-white text-xl px-6 py-3 font-bold rounded-full w-[80vw] mb-4">
            Sign in
          </button>
          {/* <button className="bg-white text-[#FF4539] border-[#FF4539] border-2 text-xl px-6 py-3 font-bold rounded-full w-[80vw] mb-4 flex"><img className="h-6 mr-4" src="https://imgs.search.brave.com/PdE0_txzUdHcbHT5AhV0yUQJQp1HsegZYHyXHuGZ3vs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9j/L2MxL0dvb2dsZV8l/MjJHJTIyX2xvZ28u/c3Zn" alt="google" />Sign in with google</button> */}
          <p>
            Already registerd? Click{" "}
            <a
              href="abc"
              className="text-center text-[#FF4539] cursor-pointer font-bold"
            >
              here
            </a>{" "}
            to log in
          </p>
        </footer>
      </div>
    </>
  );
};

export default Register;
