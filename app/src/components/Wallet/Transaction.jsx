import React from 'react'
import { FcAdvance, FcCalculator, FcCurrencyExchange, FcDataConfiguration, FcDebt } from "react-icons/fc";

const Transaction = ({value, date, title}) => {
    const currUser = JSON.parse(localStorage.getItem('user'));
    const role = currUser?.role; 
    function formatDate(dateString) {
        const date = new Date(dateString);
      
        // Extract the day, month, and year
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const hours = date.getHours();
        const minutes = date.getMinutes();
      
        // Convert to 12-hour format
        const hour12 = hours % 12 || 12;  // Convert hour to 12-hour format, 0 becomes 12
        const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
        const formattedTime = `${hour12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
      
        // Format the full date with suffix and time
        return `${day}${getDaySuffix(day)} ${month} at ${formattedTime}`;
      }
      
      // Function to get the day suffix (TH, ST, ND, RD)
      function getDaySuffix(day) {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      }
      
    return (
        <div className={value > 0 ? 'bg-green-600 border shadow-lg mt-3 py-3 px-4 rounded-xl w-full h-fit flex justify-between' : 'bg-red-600 border shadow-lg mt-3 py-3 px-4 rounded-xl w-full h-fit flex justify-between'}>
            <div className='flex gap-4 items-center'>
                <span className='rounded-full p-1'>
                    {value > 0 ? <FcCurrencyExchange size={30} /> : <FcDebt size={30} />}
                </span>
                <div className='text-white flex flex-col justify-center'>
                    <span className='text-sbase'>{title}</span>
                    <span className={`${value > 0 ? "text-green-200" : "text-red-200"} text-xs`}>{formatDate(date)}</span>
                </div>
            </div>
            <div className='flex text-white text-right text-nowrap items-center text-lg'>
                {value} pts
            </div>
        </div>
    )
}

export default Transaction
