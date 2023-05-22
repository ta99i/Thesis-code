import React, { useState } from 'react'
import {  Routes, Route,  Link } from "react-router-dom";
import '../Employer/Styles_Navbar.css'

function GNavbar() {
 const  [active,setActive]=useState(1)
  return (
    <div className='box-shadow'>
        <nav className='flex justify-around items-center font-bold text-lg p-4'>
            <div  className='text-2xl'>
                POLICE
            </div>
           <div className='flex'>
           <div className=" mr-3">
                <Link className={`p-3 text-lg font-bold uppercase ${active===1?"active":"" }`} to='/Pl/register_rs'onClick={()=>setActive(1)} >register RS </Link>
            </div>
            <div className="mr-3">
                <Link className={`p-3 text-lg font-bold uppercase ${active===2?"active":"" }`} to='/Pl/register_citizen' onClick={()=>setActive(2)} >register Citizen </Link>
            </div>
            <div className="mr-3">
                <Link className={`p-3 text-lg font-bold uppercase ${active===2?"active":"" }`} to='/Pl/update_cit' onClick={()=>setActive(2)} >update Citizen </Link>
            </div>
            <div className="">
                <Link className={`p-3 text-lg font-bold uppercase ${active===2?"active":"" }`} to='/Pl/update_rs' onClick={()=>setActive(2)} >update RS </Link>
            </div>
           </div>
        </nav>
    
    </div>
  )
}
export default GNavbar 