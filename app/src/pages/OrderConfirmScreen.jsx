import React, { useState } from 'react'
import Loading from '../components/General/Loading';
import loadingorder from '../assets/loadingorder.gif';
import { useNavigate } from 'react-router-dom';

const OrderConfirmScreen = () => {
    const [timer, setTimer] = useState(20);
    const [startTimer, setStartTimer] = useState(false);
    const navigate = useNavigate();

    setTimeout(() => {
        setStartTimer(true);
    }, 15000)

    if (startTimer) {
        setTimeout(() => {
            setTimer(timer - 1);
        }, 1000);
    }

    if (timer === -1) {
        navigate('/');
    }

  return (
    <div className='flex flex-col items-center justify-center h-screen px-10 bg-[#FFDF1D]'>
        <img src={loadingorder} alt="" />
        <h1 className='text-center text-lg font-semibold mb-8'>Please hold on while we confirm your Order!</h1>
        <Loading />
        {timer <= 19 && (
            <div>
                <h1 className='text-center italic mt-10'>Seems like no one is available to deliver your order at the moment. Try again later!</h1>
                <h1 className='text-center italic mt-4'>redirecting you in {Math.max(timer, 0)} seconds</h1>
            </div>
        )}
    </div>
  )
}

export default OrderConfirmScreen
