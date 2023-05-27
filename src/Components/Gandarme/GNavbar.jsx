import React, { useState } from 'react'
import { Link } from "react-router-dom";
import '../Employer/Styles_Navbar.css'

function GNavbar() {

  return (
    <div className='box-shadow' style={{background: 'linear-gradient(167deg, #409748ad, #0e2e11)'}}>
        <nav className='flex justify-between items-center font-bold text-lg p-4'>
            <div className='text-2xl text-white'>GANDARME</div>
            <div className='flex '>
            <div className="mr-3">
                <Link className={`mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase `} to='/Gn/register_rs' >register RS </Link>
            </div>
            <div className="mr-3">
                <Link className={`mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded uppercase`} to='/Gn/register_citizen'  >register Citizen </Link>
            </div>
            <div className="mr-3">
                <Link className={`mr-2 bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded uppercase `} to='/Gn/update_cit'  >update Citizen </Link>
            </div>
            <div className="">
                <Link className={`mr-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded uppercase `} to='/Gn/update_rs'  >update RS </Link>
            </div>
            </div>
        </nav>
    </div>
  )
}
export default GNavbar 