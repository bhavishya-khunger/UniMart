import React from "react";

function InputVal({ fieldVal, type, value, onChange }) {
  return (
    <div className="container flex flex-col mb-2">
      <label className="text-gray-600">{fieldVal}</label>
      <input onChange={onChange} value={value} type={type} className="border-b-2 text-lg outline-none w-[75vw]" />
    </div>
  );
}

export default InputVal;