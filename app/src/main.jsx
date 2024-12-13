import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import HomePage from "./pages/HomePage.jsx";
import Wallet from "./pages/Wallet.jsx";
import CartPage from "./pages/CartPage.jsx";
import Restaurant from "./pages/Restaurant.jsx";
import ShopForm from "./pages/ShopForm.jsx";
import UserProtectRoute from "./pages/UserProtectRoute.jsx";
import MenuShop from "./pages/MenuShop.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={
        <UserProtectRoute>
          <HomePage />
        </UserProtectRoute>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/shopdetails" element={
        <UserProtectRoute>
          <ShopForm />
        </UserProtectRoute>
      } />
      <Route path="/wallet" element={
        <UserProtectRoute>
          <Wallet />
        </UserProtectRoute>
      } />
      <Route path="/cart" element={
        <UserProtectRoute>
          <CartPage />
        </UserProtectRoute>
      } />
      <Route path="/:id" element={
        <UserProtectRoute>
          <Restaurant />
        </UserProtectRoute>
      } />
      <Route path="/editmenu" element={
        <UserProtectRoute>
          <MenuShop />
        </UserProtectRoute>
      } />
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
