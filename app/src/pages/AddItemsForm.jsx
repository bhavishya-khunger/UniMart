import React from 'react'
import InputVal from '../components/General/InputVal'
import burger from "../Images/HomePage/burger.png"

function AddItemsForm() {
  return (
    <div className="flex h-screen flex-col items-center justify-start">
        <img src={burger} alt="error" className='w-44'/>
      <header className="flex flex-col items-center justify-center">
        <h1 className="font-bold text-2xl mt-2 text-center mb-3">
          Welcome to UniMart!
        </h1>
        <p className="text-center text-sm text-gray-600 text-wrap px-12">
          Kindly fill the item details
        </p>
      </header>
      <main className="mt-6">
        <InputVal
          fieldVal={"Item name"}
          type={"text"}
        />
        <InputVal
          fieldVal={"Item description"}
          type={"password"}
        />
        <InputVal
        fieldVal={"Upload Image"}
        type={"file"}
        accept="image/*"
        />
        <div className="flex justify-center">
        </div>
      </main>
      <footer className="flex flex-col mt-6">
        <button
          className="bg-[#FF4539] hover:bg-orange-400 text-white text-xl px-6 py-3 font-bold rounded-full w-[80vw] mb-4 active:scale-95">
          Add item
        </button>
      </footer>
    </div>
  )
}

export default AddItemsForm