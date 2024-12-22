import React, { useContext, useEffect, useState } from 'react';
import Loading from '../components/General/Loading';
import loadingorder from '../assets/loadingorder.gif';
import acceptedorder from '../assets/acceptedorder.gif';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';

const OrderConfirmScreen = () => {
    const [timer, setTimer] = useState(20);
    const [startTimer, setStartTimer] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const navigate = useNavigate();
    const { socket } = useContext(SocketContext);

    useEffect(() => {
        // Listen for socket event "ride-confirmed"
        socket.on("order-accepted", () => {
            setAccepted(true);
            setTimeout(() => {
                navigate('/');
            }, 3500)
        });

        // Cleanup the socket listener when component unmounts
        return () => {
            socket.off("order-accepted");
        };
    }, [navigate, socket]);

    useEffect(() => {
        // Start the timer after 15 seconds
        const timerStartTimeout = setTimeout(() => {
            setStartTimer(true);
        }, 15000);

        // If timer is started, countdown every second
        const countdownTimeout = startTimer && setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer <= 1) {
                    clearInterval(countdownTimeout);
                    navigate('/'); // Redirect after the countdown ends
                }
                return prevTimer - 1;
            });
        }, 1000);

        // Cleanup timeouts/intervals when component unmounts or timer changes
        return () => {
            clearTimeout(timerStartTimeout);
            clearInterval(countdownTimeout);
        };
    }, [startTimer, navigate]);

    return (
        <>
            {!accepted && (
                <div className='flex flex-col items-center justify-center h-screen px-10 bg-[#FFDF1D]'>
                    <img src={loadingorder} alt="" />
                    <h1 className='text-center text-lg font-semibold mb-8'>Please hold on while we confirm your Order!</h1>
                    <Loading />
                    {timer <= 19 && (
                        <div>
                            <h1 className='text-center italic mt-10'>Seems like no one is available to deliver your order at the moment. Try again later!</h1>
                            <h1 className='text-center italic mt-4'>Redirecting you in {Math.max(timer, 0)} seconds</h1>
                        </div>
                    )}
                </div>
            )}
            {accepted && (
                <div className='flex flex-col items-center justify-center h-screen px-10 bg-[#fbfbfb]'>
                <img src={acceptedorder} alt="" />
                <h1 className='text-center text-lg font-semibold mb-8'>Your order is confirmed!!</h1>
            </div>
            )}
        </>
    );
};

export default OrderConfirmScreen;
