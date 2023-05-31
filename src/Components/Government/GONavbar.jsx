import React from 'react'
import { Link } from "react-router-dom";
import '../Employer/Styles_Navbar.css'

function GONavbar() {

    return (
        <div className='box-shadow'>
      <nav className="flex items-center justify-between bg-gray-800 p-4">
        <div className="flex items-center">
          <span className="text-white font-bold text-2xl uppercase">Government</span>
        </div>
        <div className="flex items-center">
          <Link className={`mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded `}  to='/Gv/add_state' >
            ADD ROLES
          </Link>
          <Link className={`mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded`} to='/Gv/add_employer'  >
            ADD EMPLOYER 
          </Link>
          <Link className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded `} to='/Gv/delete_employer' >
            DELETE EMPLOYER 
          </Link>
        </div>
      </nav>
      </div>
    );
  };
export default GONavbar 