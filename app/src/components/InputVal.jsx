import React from "react";

function InputVal({ max, min, disabled, value, fieldVal, type, accept }) {
  return (
    <div className="container flex flex-col">
      <label className="text-lg text-gray-600">{fieldVal}</label>
      <input minLength={min} maxLength={max} disabled={disabled} value={value} type={type} className="border-b-2 outline-none w-[75vw]" accept={accept}/>
    </div>
  );
}

export default InputVal;