import React from 'react'
import Navbar from "./Components/Employer/Navbar";
import {  Routes, Route,  Link } from "react-router-dom";
import Register from './Components/Employer/Register.jsx';
import Transfer from './Components/Employer/Transfer.jsx';
function Employer() {
  return (
    <div>
        <Navbar/>
        {/* <Routes >
        <Route  path="/empl/register" element={<Register />} />
          <Route  path="/empl/transfer" element={<Transfer />} />
          </Routes> */}
    </div>
  )
}

export default Employer