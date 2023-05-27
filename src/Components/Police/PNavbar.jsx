import React from 'react'
import {  Link } from "react-router-dom";
import '../Employer/Styles_Navbar.css'

function PNavbar() {
  return (
    <div className='box-shadow' style={{background: 'rgba(0,0,0,0.8)'}}>
        <nav className='flex justify-between items-center font-bold text-lg p-4'>
            <div  className='text-white font-bold text-2xl uppercase'>
                POLICE
            </div>
           <div className='flex'>
           <div className=" mr-3">
                <Link className={`mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase`} to='/Pl/register_rs' >register RS </Link>
            </div>
            <div className="mr-3">
                <Link className={`mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded  uppercase`} to='/Pl/register_citizen'  >register Citizen </Link>
            </div>
            <div className="mr-3">
                <Link className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded uppercase`} to='/Pl/update_cit'  >update Citizen </Link>
            </div>
            <div className="">
                <Link className={`bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded uppercase`} to='/Pl/update_rs'  >update RS </Link>
            </div>
           </div>
        </nav>
    
    </div>
  )
}
export default PNavbar 