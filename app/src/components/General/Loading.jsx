import React from 'react';

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center h-fit">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
        </div>
    );
};

export default Loading;
