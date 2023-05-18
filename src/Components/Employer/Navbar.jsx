import React, { useState } from 'react'
import {  Routes, Route,  Link } from "react-router-dom";
import './Styles_Navbar.css'

function Navbar() {
 const  [active,setActive]=useState(1)
  return (
    <div>
        <nav className='flex justify-evenly p-4'>
            <div className="">
                <Link className={`p-3 text-xl font-bold ${active===1?"active":"" }`} to='/empl/register'onClick={()=>setActive(1)} >register </Link>
            </div>
            <div className="">
                <Link className={`p-3 text-xl font-bold ${active===2?"active":"" }`} to='/empl/transfer' onClick={()=>setActive(2)} >transfer </Link>
            </div>
        </nav>
    
    </div>
  )
}

export default Navbar