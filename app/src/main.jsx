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
import ShopKeeperWrapper from "./pages/ShopKeeperWrapper.jsx";
import AdminInsights from "./pages/AdminInsights.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={
        <UserProtectRoute>
          <ShopKeeperWrapper>
            <HomePage />
          </ShopKeeperWrapper>
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
          <ShopKeeperWrapper>
            <Wallet />
          </ShopKeeperWrapper>
        </UserProtectRoute>
      } />
      <Route path="/cart" element={
        <UserProtectRoute>
          <ShopKeeperWrapper>
            <CartPage />
          </ShopKeeperWrapper>
        </UserProtectRoute>
      } />
      <Route path="/admininsights" element={
        <UserProtectRoute>
          <ShopKeeperWrapper>
            <AdminInsights />
          </ShopKeeperWrapper>
        </UserProtectRoute>
      } />
      <Route path="/:shopId" element={
        <UserProtectRoute>
          <ShopKeeperWrapper>
            <Restaurant />
          </ShopKeeperWrapper>
        </UserProtectRoute>
      } />
      <Route path="/editmenu" element={
        <UserProtectRoute>
          <ShopKeeperWrapper>
            <MenuShop />
          </ShopKeeperWrapper>
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
