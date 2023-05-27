import React from 'react'
import {  Link } from "react-router-dom";
import '../Employer/Styles_Navbar.css'

function TNavbar() {

  return (
    <div className='box-shadow' style={{background: 'linear-gradient(167deg, #1d5d90, #e3e3e3)'}}>
        <nav className='flex justify-around items-center font-bold text-lg p-4'>
           
           <div  className='text-2xl text-white'>TAX</div>
           <div className='flex'>
           <div className="mr-4">
                <Link className={`mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase `} to='/Tx/register_citizen'  >register Citizen </Link>
            </div>
            <div className="">
                <Link className={`mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded uppercase`} to='/Tx/update_cit' >update Citizen </Link>
            </div>
           </div>
        </nav>
    
    </div>
  )
}
export default TNavbar 