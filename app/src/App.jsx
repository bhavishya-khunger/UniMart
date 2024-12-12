import React from 'react'
import Register from './pages/Register'
import { BrowserRouter } from 'react-router-dom'
import HomePage from './pages/HomePage'

const App = () => {
  return (
    <div>
      <Register/>
      <HomePage/>
    </div>
  )
}

export default App
