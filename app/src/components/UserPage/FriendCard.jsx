import React from 'react'
import { MdDelete, MdDone } from 'react-icons/md'

const FriendCard = ({ deleteTrue, accept, reject, name, sid, controls }) => {
    return (
        <div className="flex mb-2 justify-between px-3 py-2 rounded-xl gap-2 shadow-md border">
            <span className='flex items-center gap-2'>
                <span className="flex items-center justify-center bg-blue-300 h-12 w-12 rounded-full text-2xl font-semibold">
                    {name && name[0]}
                </span>
                <span>
                    <h2 className="text-base font-semibold">{name}</h2>
                    <h2 className="text-sm">SID : {sid}</h2>
                </span>
            </span>
            {controls && (
                <span className='flex items-center gap-1'>
                    <span className="ml-3 h-10 w-10 bg-green-500 text-white text-xl flex items-center justify-center rounded-full active:scale-90">
                        <MdDone />
                    </span>
                    <span className="h-10 w-10 bg-red-500 text-white text-xl flex items-center justify-center rounded-full active:scale-90">
                        <MdDelete />
                    </span>
                </span>
            )}
            {deleteTrue && (
                <span className='flex items-center gap-1'>
                    <span className="h-10 w-10 bg-red-500 text-white text-xl flex items-center justify-center rounded-full active:scale-90">
                        <MdDelete />
                    </span>
                </span>
            )}
        </div>
    )
}

export default FriendCard
