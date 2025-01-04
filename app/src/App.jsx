import React, { useEffect, useState, useContext } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom';
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
import { SocketContext } from './context/SocketContext.jsx';
import LiveRequest from './pages/LiveRequest.jsx';
import UserProfile from './pages/UserProfile.jsx';
import OrderPageNav from './pages/OrderPageNav.jsx';
import PdfUpload from './pages/PdfUpload.jsx';
import { UserDataContext } from './context/UserContext.jsx'
import OTPPage from './pages/OtpVerification.jsx';
import OtpProtect from './pages/OtpProtect.jsx';

const App = () => {
  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket.emit("join", { userId: user?._id });
    socket.on("order-request", () => {
      navigate("/liverequest");
    })
    socket.on("friendRequestReceived", (data) => {
      setUser(data);
    })
    socket.on("friendDeleted", (data) => {
      setUser(data);
    })
    socket.on("friendRequestApproved", (data) => {
      setUser(data);
    })
  }, [user])
  return (
    <div className='h-full w-full flex flex-col'>
      <Routes>
        <Route path="/" element={
          <UserProtectRoute>
            <OtpProtect>
              <ShopKeeperWrapper>
                <HomePage />
              </ShopKeeperWrapper>
            </OtpProtect>
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
        <Route path="/pdfpage" element={<PdfUpload />} />
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
        <Route path="/editmenu/add" element={
          <UserProtectRoute>
            <ShopKeeperWrapper>
              <AddItemsForm />
            </ShopKeeperWrapper>
          </UserProtectRoute>
        } />
        <Route path="/addItems" element={<AddItemsForm />} />
        <Route path="/order" element={<OrderPageNav />} />
        <Route path="/userpage" element={<UserPage />} />
        <Route path="/userpage/profile" element={<UserProfile />} />
        <Route path="/cart/order" element={<OrderConfirmScreen />} />
        <Route path="/liverequest" element={<LiveRequest />} />
        <Route path='/pdf' element={<PdfUpload />} />
        <Route path='/verifymail' element={<OTPPage />} />
      </Routes>
    </div>
  )
}

export default App
