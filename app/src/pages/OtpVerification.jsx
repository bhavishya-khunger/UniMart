import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';

const OTPPage = () => {
    const {user, setUser} = useContext(UserDataContext);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const navigate = useNavigate();
    const userEmail = user?.email;
    const otpRefs = useRef([]);

    useEffect(() => {
        if (timer === 0) return;

        const intervalId = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timer]);

    useEffect(() => {
        if (otp.every(digit => digit !== '')) {
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }, [otp]);

    const handleOtpChange = (e, index) => {
        const value = e.target.value;

        if (/[^0-9]/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleSubmit = async () => {
        const otpCode = otp.join('');
        console.log(otpCode);

        try {
            const data = {email: userEmail, otp: otpCode};
            console.log(data);
            const response = await axios.post(`${import.meta.env.VITE_USER_BASE_URL}/verify-otp`, data);

            console.log(response);

            if (response.status === 200) {
                setIsOtpVerified(true);
                setAlertMessage('OTP verified successfully!');
                setUser({...user, isEmailVerified: true});
                navigate('/');
            } else {
                setAlertMessage('Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setAlertMessage(error?.response?.data?.message || 'Error verifying OTP. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center w-full justify-center min-h-screen bg-white">
            <img src="https://img.freepik.com/premium-vector/enter-otp-concept-illustration_86047-735.jpg" alt="" />
            <div className="w-full max-w-sm p-6 rounded-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Verify your Email by entering OTP sent to</h2>
                <h2 className="font-semibold italic text-center mb-6">{userEmail}</h2>
                <div className="flex justify-between mb-4">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            value={digit}
                            onChange={(e) => handleOtpChange(e, index)}
                            maxLength="1"
                            ref={(el) => (otpRefs.current[index] = el)}
                            className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    ))}
                </div>
                {alertMessage && <p className={`text-center ${isOtpVerified ? 'text-green-500' : 'text-red-500'}`}>{alertMessage}</p>}
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitDisabled}
                    className={`w-full py-2 text-white rounded-md ${isSubmitDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default OTPPage;
