import React from "react";

function InputVal({ fieldVal, type, accept }) {
  return (
    <div className="container flex flex-col">
      <label className="text-lg text-gray-600">{fieldVal}</label>
      <input type={type} className="border-b-2 outline-none w-[75vw]" accept={accept}/>
    </div>
  );
}

export default InputVal;