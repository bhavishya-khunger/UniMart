# UniMart - Peer-to-Peer Food Delivery and Print-on-Demand Service

## Overview

UniMart is an innovative peer-to-peer food delivery application designed to streamline the process of ordering food and printing documents within a campus environment. The platform connects students and shopkeepers, allowing for efficient food delivery and convenient print-on-demand services.

## Features

### Food Delivery
- **Order Placement**: Users can browse through various restaurants and place orders for their favorite meals.
- **Cart Management**: Add, remove, and update items in the cart before placing an order.
- **Order Tracking**: Track the status of orders from placement to delivery.
- **Delivery Management**: Students can opt to deliver orders and earn rewards.

### Print-on-Demand
- **PDF Upload**: Users can upload PDF documents for printing.
- **Vendor Selection**: Choose from a list of verified print vendors.
- **Order Customization**: Add comments and special instructions for print orders.
- **Order Tracking**: Track the status of print orders from submission to completion.

## Technical Stack

### Frontend
- **React**: For building the user interface.
- **Axios**: For making HTTP requests to the backend.
- **Tailwind CSS**: For styling the application.
- **React Router**: For navigation and routing.

### Backend
- **Node.js**: For server-side logic.
- **Express.js**: For building the RESTful API.
- **MongoDB**: For database management.
- **Mongoose**: For object data modeling (ODM).
- **Socket.io**: For real-time communication between users.

## Directory Structure

### Frontend (app)

app/
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── public/
├── README.md
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── assets/
│   │   └── printer.avif
│   ├── components/
│   ├── context/
│   ├── extras
│   ├── Images/
│   ├── index.css
│   ├── main.jsx
│   ├── pages/
│   └── utils/
├── tailwind.config.js
└── vite.config.js


### Backend (server)

server/
├── .env
├── config/
│   └── db.js
├── controllers/
│   ├── admin.controller.js
│   ├── cart.controller.js
│   ├── otp.controller.js
│   ├── printer.controller.js
│   ├── product.controller.js
│   ├── shop.controller.js
│   └── user.controller.js
├── middlewares/
│   └── auth.user.js
├── models/
├── package.json
├── routes/
└── src/



## API Documentation

### User Routes
- **POST /api/v1/users/register**: Register a new user.
- **POST /api/v1/users/login**: Log in a user.
- **GET /api/v1/users/logout**: Log out a user.
- **POST /api/v1/users/edit**: Edit user profile.
- **GET /api/v1/users/profile**: Get user profile.
- **GET /api/v1/users/transactions/:userId**: Get transaction history for a user.
- **GET /api/v1/users/orders/:userId**: Get orders for a shop.
- **POST /api/v1/users/accept-orders**: Start accepting orders.
- **POST /api/v1/users/verify-shop**: Verify a shop.

### Product Routes
- **GET /api/v1/products/:shopId**: Get products for a shopkeeper.
- **GET /api/v1/products/menu/:userId**: Get menu by shopkeeper ID.
- **GET /api/v1/products/delete/:productId**: Delete a product.
- **POST /api/v1/products/add**: Add a new product.

### Shop Routes
- **GET /api/v1/shops/get-shops**: Get all verified shops.
- **GET /api/v1/shops/get-unverified**: Get all unverified shops.
- **POST /api/v1/shops/create-shop**: Create a new shop.

### Cart Routes
- **GET /api/v1/cart/getcart/:userId**: Get the cart for a user.
- **POST /api/v1/cart/add**: Add an item to the cart.
- **POST /api/v1/cart/remove**: Remove an item from the cart.
- **POST /api/v1/cart/order**: Place an order from the cart.
- **POST /api/v1/cart/order/request**: Send an order request.
- **POST /api/v1/cart/order/confirm**: Confirm an order.
- **POST /api/v1/cart/order/cancel**: Cancel an order.
- **POST /api/v1/cart/order/markForPickup**: Mark an order for pickup.
- **POST /api/v1/cart/order/markForDelivery**: Mark an order out for delivery.
- **POST /api/v1/cart/order/markDelivered**: Process an order delivery.
- **GET /api/v1/cart/order/history/:userId**: Get order history for a user.

## Conclusion

UniMart aims to enhance the campus experience by providing a seamless platform for food delivery and print-on-demand services. With its user-friendly interface and robust backend, UniMart ensures efficient and reliable service for all users.

---

This document provides a comprehensive overview of the UniMart project, highlighting its features, technical stack, directory structure, and API documentation.
