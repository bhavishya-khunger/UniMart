import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import HomePage from "./pages/HomePage.jsx";
import Wallet from "./pages/Wallet.jsx";
import CartPage from "./pages/CartPage.jsx";
import Restaurant from "./pages/Restaurant.jsx";
import ShopForm from "./pages/ShopForm.jsx";
import UserProtectRoute from "./pages/UserProtectRoute.jsx";
import MenuShop from "./pages/MenuShop.jsx";
import AddItemsForm from "./pages/AddItemsForm.jsx";
import ShopKeeperWrapper from "./pages/ShopKeeperWrapper.jsx";
import AdminInsights from "./pages/AdminInsights.jsx";
import UserPage from "./pages/UserPage.jsx";
import OrderConfirmScreen from "./pages/OrderConfirmScreen.jsx";
import LiveRequest from "./pages/LiveRequest.jsx";
import DeliveryListener from './components/DeliveryListener.jsx';

const App = () => {
  const [liveRequest, setLiveRequest] = useState(null);
  return (
    <div className='h-full w-full flex flex-col'>
      <DeliveryListener setLiveRequest={setLiveRequest} />
      <Routes>
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
        <Route path="/addItems" element={<AddItemsForm />} />
        <Route path="/userpage" element={<UserPage />} />
        <Route path="/cart/order" element={<OrderConfirmScreen />} />
        <Route path="/liverequest" element={<LiveRequest liveRequest={liveRequest} setLiveRequest={setLiveRequest} />} />
        {/* Other Routes */}
      </Routes>
    </div>
  )
}

export default App
