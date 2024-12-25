import React from 'react'

const Request = ({ name, shopName, email, onClick }) => {
    return (
        <div className="bg-white mt-4 border shadow-md rounded-xl px-4 py-4 text-lg font-medium text-gray-900 flex flex-col items-start">
            <p className="text-justify"><b>Name:</b> {name}</p>
            <p className="text-justify"><b>Email:</b> {email}</p>
            <p className="text-justify">
                <b>Restaurant:</b> {shopName}
            </p>
            <div className="flex mt-4">
                <button
                    onClick={onClick}
                    className="w-36 h-12 bg-green-200 text-lg font-bold text-black rounded-lg border-2 border-green-300 mr-4 active:scale-95">
                    Accept
                </button>
                <button
                    className="w-36 h-12 bg-red-200 text-lg font-bold text-black rounded-lg border-2 border-red-300 active:scale-95">
                    Deny
                </button>
            </div>
        </div>
    )
}

export default Request