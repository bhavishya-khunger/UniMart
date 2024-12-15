import React from 'react';
import { MdError } from "react-icons/md";

const ErrorPop = ({text}) => {
    return (
        <div className="text-wrap gap-1 flex px-3 justify-center items-center bg-red-100 w-fit py-2 rounded-full mt-3 text-red-600">
            <MdError size={30} />
            {text}
        </div>
    )
}

export default ErrorPop
