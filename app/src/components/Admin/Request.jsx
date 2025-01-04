import React from 'react'

const Request = ({ name, image, shopName, email, onClick }) => {
    return (
        <div className="bg-white mt-4 border shadow-md rounded-xl px-4 py-4 text-lg font-medium text-gray-900 flex flex-col items-start">
            <div style={{ backgroundImage: `url(${image})` }} className="h-40 rounded-xl border-2 border-black mb-2 w-full bg-cover"></div>
            <p className="text-justify"><b>Name:</b> {name}</p>
            <p className="text-justify"><b>Email:</b> {email}</p>
            <p className="text-justify">
                <b>Restaurant:</b> {shopName}
            </p>
            <div className="flex mt-4 w-full">
                <button
                    onClick={() => onClick()}
                    className="w-full h-12 bg-green-200 text-lg font-bold text-black rounded-lg border-2 border-green-300 active:scale-95">
                    Accept
                </button>
            </div>
        </div>
    )
}

export default Request
