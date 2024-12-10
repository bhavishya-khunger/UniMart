import React from 'react';
import Register from './pages/Register';
import { Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <Routes> 
      <Route path='/register' element={<Register/>} />
    </Routes>
  )
}

export default App
