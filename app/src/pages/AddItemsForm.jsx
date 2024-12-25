import React, { useState } from 'react';
import InputVal from '../components/General/InputVal';
import additems from "../assets/additems.webp";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorPop from '../components/General/ErrorPop';

function AddItemsForm() {
  const navigate = useNavigate();
  const [errorText, setErrorText] = useState("");
  const currUser = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    itemName: '',
    itemDescription: '',
    itemImageLink: '',
    itemType: 'veg',
    price: 0,
  });

  const updatedPrice = Math.ceil(1.05 * formData.price);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_PRODUCT_BASE_URL}/add`, {
        userId: currUser?._id,
        productName: formData?.itemName,
        price: updatedPrice,
        isVeg: formData?.itemType === 'veg',
        productImg: formData?.itemImageLink,
        desc: formData?.itemDescription
      });
      console.log("Item added to the menu: ", res);
      return navigate('/editmenu');
    } catch (error) {
      console.log(error);
      setErrorText(error?.response?.data?.message)
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-start">
      <img src={additems} alt="error" className='w-40 mt-3' />
      <header className="flex flex-col items-center justify-center">
        <h1 className="font-bold text-2xl mt-2 text-center mb-3">
          Add A New Creation
        </h1>
        <p className="text-center text-sm text-gray-600 text-wrap px-12">
          Add the item details correctly to expand your menu's vastness!
        </p>
      </header>
      <main className="mt-6">
        <InputVal
          fieldVal="Item Name"
          type="text"
          name="itemName"
          value={formData.itemName}
          onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
        />
        <InputVal
          fieldVal="Item Description"
          type="text"
          name="itemDescription"
          value={formData.itemDescription}
          onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
        />
        <InputVal
          fieldVal="Item Image Link"
          type="text"
          name="itemImageLink"
          value={formData.itemImageLink}
          onChange={(e) => setFormData({ ...formData, itemImageLink: e.target.value })}
        />
        <div className="container flex flex-col mb-2">
          <label className="text-gray-600 mb-2">Item Type</label>
          <select
            name="itemType"
            className="bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 text-black"
            value={formData.itemType}
            onChange={(e) => setFormData({ ...formData, itemType: e.target.value })}
          >
            <option value="veg">Vegetarian</option>
            <option value="nonVeg">Non-Vegetarian</option>
          </select>
        </div>
        <InputVal
          fieldVal="Price"
          type="number"
          name="price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
        />
        <p className='text-gray-500'>Marked Price on Menu : {updatedPrice}</p>
        <div className="flex justify-center">
          <p className='text-xs text-center mt-4 text-gray-400'>The prices of the items will be marked 5% higher <br /> than the actual price of the item.</p>
        </div>
      </main>
      <footer className="flex items-center flex-col mt-3 gap-4">
        {errorText && <ErrorPop text={errorText} />}
        <button
          onClick={handleSubmit}
          className="bg-[#FF4539] hover:bg-orange-400 text-white text-xl px-6 py-3 font-bold rounded-full w-[80vw] mb-8 active:scale-95">
          Add item
        </button>
      </footer>
    </div>
  );
}

export default AddItemsForm;
