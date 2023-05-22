import React, { useState } from 'react'
import {  Link } from "react-router-dom";
import '../Employer/Styles_Navbar.css'

function TNavbar() {
 const  [active,setActive]=useState(1)
  return (
    <div className='box-shadow'>
        <nav className='flex justify-around items-center font-bold text-lg p-4'>
           
           <div  className='text-2xl'>TAX</div>
           <div className='flex'>
           <div className="mr-4">
                <Link className={`p-3 text-lg font-bold uppercase ${active===2?"active":"" }`} to='/Tx/register_citizen' onClick={()=>setActive(2)} >register Citizen </Link>
            </div>
            <div className="">
                <Link className={`p-3 text-lg font-bold uppercase ${active===2?"active":"" }`} to='/Tx/update_cit' onClick={()=>setActive(2)} >update Citizen </Link>
            </div>
           </div>
        </nav>
    
    </div>
  )
}
export default TNavbar 