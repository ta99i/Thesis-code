import React, { useState } from 'react'
import {Link } from "react-router-dom";
import './Styles_Navbar.css'

function Navbar() {
 const  [active,setActive]=useState(1)
  return (
    <div className='box-shadow'>
        <nav className='flex justify-around items-center font-bold text-lg p-2'>
            <div className='text-2xl'>
            COMMUNE
            </div>
           <div className='flex justify-evenly  width'>
           <div className="flex">
                <Link className={`p-2 text-lg font-bold uppercase ${active===1?"active":"" }`} to='/empl/register'onClick={()=>setActive(1)} >register </Link>
            </div>
            <div className="flex">
                <Link className={`p-2 text-lg font-bold uppercase ${active===2?"active":"" }`} to='/empl/transfer' onClick={()=>setActive(2)} >transfer </Link>
            </div>
           </div>
        </nav>
    
    </div>
  )
}

export default Navbar