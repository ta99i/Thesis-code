// import {  Routes, Route,  Link } from "react-router-dom";
import './App.css';
import Navbar from "./Components/Employer/Navbar";


import { ConnectButton, Loading } from "@web3uikit/web3";
import { useMoralis } from "react-moralis";
import { useEffect } from "react";
import Home from './Home';
import RigisterCitizen from './Components/Gandarme/RigisterCitizen';
import Register_rs from './Components/Gandarme/Register_rs';
import Register from './Components/Employer/Register';
import Transfer from './Components/Employer/Transfer';

import {  Routes, Route,  Link } from "react-router-dom";
function App() {
  const {isWeb3Enabled } = useMoralis();
  return (
    <div className="App">
     { !isWeb3Enabled &&
        
        <Home/>      
      }

      <Routes >
          <Route  path="/"  element={<Register/>} />
          <Route  path="/empl/register" element={<Register />} />
          <Route  path="/empl/transfer" element={<Transfer />} />
          <Route  path="/Gn/register_citizen" element={<RigisterCitizen />} />
          <Route  path="/Gn/register_rs" element={<Register_rs />} />
      </Routes> 
    </div>
  );
}

export default App;
