import React from "react";
import otpImage from "../Images/HomePage/otpImage.png";
const email = "abcd@5128.com"
function OtpVerification() {
  return (
    <>
    <div className="imageContainer flex items-center justify-center">
      <img src={otpImage} alt="error" className="h-56"/>
      </div>
      <h1 className="text-2xl text-center font-bold mb-4">OTP Verifcation</h1>
      <p className="text-center mb-4">
        One time password (OTP) has been sent via Email to{" "}
        <b>{email}</b>
      </p>
      <p className="text-center mb-4">Enter the OTP below to verify it</p>
      <div className="flex items-center justify-center">
        <input type="text" name="" id="" className="text-center border-b-2 border-gray-700 w-[80vw] outline-none " />
      </div>
      <div className="flex items-center justify-center mt-6">
        <button className="bg-blue-800 w-36 h-10 text-gray-100 text-xl rounded-2xl">Submit</button>
      </div>
    </>
  );
}

export default OtpVerification;
