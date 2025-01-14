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
    socket.on("transaction-event-trigger", (data) => {
      setUser(data);
    })
  }, [user])
  return (
    <div className='rounded-xl w-[390px] flex flex-col '>
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
            <OtpProtect>
              <ShopKeeperWrapper>
                <ShopForm />
              </ShopKeeperWrapper>
            </OtpProtect>
          </UserProtectRoute>
        } />
        <Route path="/wallet" element={
          <UserProtectRoute>
            <OtpProtect>
              <ShopKeeperWrapper>
                <Wallet />
              </ShopKeeperWrapper>
            </OtpProtect>
          </UserProtectRoute>
        } />
        <Route path="/cart" element={
          <UserProtectRoute>
            <ShopKeeperWrapper>
              <OtpProtect>
                <CartPage />
              </OtpProtect>
            </ShopKeeperWrapper>
          </UserProtectRoute>
        } />
        <Route path="/admininsights" element={
          <UserProtectRoute>
            <ShopKeeperWrapper>
              <OtpProtect>
                <AdminInsights />
              </OtpProtect>
            </ShopKeeperWrapper>
          </UserProtectRoute>
        } />
        <Route path="/pdfpage" element={
          <UserProtectRoute>
            <OtpProtect>
              <ShopKeeperWrapper>
                <PdfUpload />
              </ShopKeeperWrapper>
            </OtpProtect>
          </UserProtectRoute>
        } />
        <Route path="/:shopId" element={
          <UserProtectRoute>
            <ShopKeeperWrapper>
              <OtpProtect>
                <Restaurant />
              </OtpProtect>
            </ShopKeeperWrapper>
          </UserProtectRoute>
        } />
        <Route path="/editmenu" element={
          <UserProtectRoute>
            <OtpProtect>
              <ShopKeeperWrapper>
                <MenuShop />
              </ShopKeeperWrapper>
            </OtpProtect>
          </UserProtectRoute>
        } />
        <Route path="/editmenu/add" element={
          <UserProtectRoute>
            <OtpProtect>
              <ShopKeeperWrapper>
                <AddItemsForm />
              </ShopKeeperWrapper>
            </OtpProtect>
          </UserProtectRoute>
        } />
        <Route path="/order" element={
          <UserProtectRoute>
            <OtpProtect>
              <ShopKeeperWrapper>
                <OrderPageNav />
              </ShopKeeperWrapper>
            </OtpProtect>
          </UserProtectRoute>
        } />
        <Route path="/userpage" element={
          <UserProtectRoute>
            <OtpProtect>
              <ShopKeeperWrapper>
                <UserPage />
              </ShopKeeperWrapper>
            </OtpProtect>
          </UserProtectRoute>
        } />
        <Route path="/userpage/profile" element={
          <UserProtectRoute>
            <OtpProtect>
              <ShopKeeperWrapper>
                <UserProfile />
              </ShopKeeperWrapper>
            </OtpProtect>
          </UserProtectRoute>
        } />
        <Route path="/cart/order" element={
          <UserProtectRoute>
            <OtpProtect>
              <ShopKeeperWrapper>
                <OrderConfirmScreen />
              </ShopKeeperWrapper>
            </OtpProtect>
          </UserProtectRoute>
        } />
        <Route path="/liverequest" element={
          <UserProtectRoute>
            <OtpProtect>
              <ShopKeeperWrapper>
                <LiveRequest />
              </ShopKeeperWrapper>
            </OtpProtect>
          </UserProtectRoute>
        } />
        <Route path='/pdf' element={
          <UserProtectRoute>
            <OtpProtect>
              <ShopKeeperWrapper>
                <PdfUpload />
              </ShopKeeperWrapper>
            </OtpProtect>
          </UserProtectRoute>
        } />
        <Route path='/verifymail' element={
          <OTPPage />
        } />
      </Routes>
    </div>
  )
}

export default App
