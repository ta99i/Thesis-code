import React, { useState } from 'react'
import {  Routes, Route,  Link } from "react-router-dom";
// import './Styles_Navbar.css'

function GNavbar() {
 const  [active,setActive]=useState(1)
  return (
    <div>
        <nav className='flex justify-evenly p-4'>
            <div className="">
                <Link className={`p-3 text-xl font-bold ${active===1?"active":"" }`} to='/Gn/Register_rs'onClick={()=>setActive(1)} >register RS </Link>
            </div>
            <div className="">
                <Link className={`p-3 text-xl font-bold ${active===2?"active":"" }`} to='/Gn/RigisterCitizen' onClick={()=>setActive(2)} >register Citizen </Link>
            </div>
        </nav>
    
    </div>
  )
}
export default GNavbar 