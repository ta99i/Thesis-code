import React, { useState } from 'react'
import {Link } from "react-router-dom";
import './Styles_Navbar.css'

function Navbar() {
 
  return (
    <div className='box-shadow' style={{backgroundColor:'rgb(102 231 114)'}}>
        <nav className='flex justify-around items-center font-bold text-lg p-2'>
            <div className='text-2xl text-white font-bold'>
            COMMUNE
            </div>
           <div className='flex justify-evenly  width'>
           <div className="flex">
                <Link className={`mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase `} to='/empl/register' >register </Link>
            </div>
            <div className="flex">
                <Link className={`mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded uppercase `} to='/empl/transfer'  >transfer </Link>
            </div>
            <div className="flex">
                <Link className={`mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded uppercase `} to='/empl/search'  >search </Link>
            </div>
           </div>
        </nav>
    
    </div>
  )
}

export default Navbar