import React from "react";

function InputVal({ disabled, fieldVal, type, value, onChange, max, min }) {
  return (
    <div className="container flex flex-col mb-2">
      <label className="text-gray-600">{fieldVal}</label>
      <input disabled={disabled} maxLength={max} minLength={min} onChange={onChange} value={value} type={type} className="border-b-2 text-lg outline-none w-[75vw]" />
    </div>
  );
}

export default InputVal;