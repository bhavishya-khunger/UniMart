import React from "react";

const Restaurant = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800">
      <header className="flex items-center justify-between bg-white shadow-md p-4">
        <div
          id="back"
          className="h-6 w-6 bg-cover"
          style={{ backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/006/991/685/non_2x/arrow-back-icon-which-is-suitable-for-commercial-work-and-easily-modify-or-edit-it-vector.jpg')" }}
        ></div>
        <a id="name" href="#" className="text-xl font-bold text-black">
          FORKS AND KNIVES
        </a>
        <div className="flex gap-4">
          <div
            id="save"
            className="h-6 w-6 bg-cover"
            style={{ backgroundImage: "url('bookmark-regular.svg')" }}
          ></div>
          <div
            id="options"
            className="h-6 w-2 bg-cover"
            style={{ backgroundImage: "url('ellipsis-vertical-solid.svg')" }}
          ></div>
        </div>
      </header>

      <main className="flex-grow px-4 py-8">
        <div id="item1" className="max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Snacks For You</h1>
          <div
            id="veglogo"
            className="h-6 w-6 bg-cover mb-2"
            style={{ backgroundImage: "url('https://i.pinimg.com/736x/e4/1f/f3/e41ff3b10a26b097602560180fb91a62.jpg')" }}
          ></div>
          <h2 className="text-xl font-semibold mb-2">Tandoori Treat Burger</h2>
          <p id="para1" className="text-lg text-gray-600 mb-4">
            Made with sliced onions, carrots, yogurt and other interesting
            ingredients.
          </p>
          <div
            id="burger"
            className="rounded-lg h-44 w-48 bg-cover mx-auto"
            style={{ backgroundImage: "url('https://assets.epicurious.com/photos/5c745a108918ee7ab68daf79/master/pass/Smashburger-recipe-120219.jpg')" }}
          ></div>
        </div>
      </main>

      <footer className="bg-gray-100 shadow-inner py-4 px-6 flex items-center justify-between">
        <input
          id="searchbox"
          type="text"
          placeholder="Search in menu"
          className="flex-grow mr-4 px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          id="menu"
          className="px-6 py-3 text-lg text-white bg-black rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
        >
          Menu
        </button>
        <span id="search" className="text-2xl text-gray-600 ml-4">&#128269;</span>
      </footer>
    </div>
  );
};

export default Restaurant;
