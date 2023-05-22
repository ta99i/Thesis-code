import './App.css';
import Navbar from "./Components/Employer/Navbar";
import { ConnectButton, Loading } from "@web3uikit/web3";
import { useMoralis } from "react-moralis";
import Home from './Home';
import RigisterCitizen from './Components/Gandarme/RigisterCitizen';
import Register_rs from './Components/Gandarme/Register_rs';
import Register from './Components/Employer/Register';
import Transfer from './Components/Employer/Transfer';
import Register_rs_pl from './Components/Police/Register_rs';
import RigisterCitizen_pl from './Components/Police/RigisterCitizen';
import RigisterCitizen_Tax from './Components/Tax/RigisterCitizen';
import {  Routes, Route,  Link } from "react-router-dom";
import Update_citizens_g from './Components/Gandarme/Update_citizens_g';
import Update_rs_G from './Components/Gandarme/Update_rs_G';
import Update_citizens_p from './Components/Police/Update_citizens_p';
import Update_rs_p from './Components/Police/Update_rs_p';
import Update_citizens_t from './Components/Tax/Update_citizens_t'
function App() {
  const {isWeb3Enabled } = useMoralis();
   console.log(isWeb3Enabled)
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
          <Route  path="/Gn/update_cit" element={<Update_citizens_g />} />
          <Route  path="/Gn/update_rs" element={<Update_rs_G />} />
          <Route  path="/Pl/register_citizen" element={<RigisterCitizen_pl />} />
          <Route  path="/Pl/register_rs" element={<Register_rs_pl />} />
          <Route  path="/Pl/update_cit" element={<Update_citizens_p />} />
          <Route  path="/Pl/update_rs" element={<Update_rs_p />} />
          <Route  path="/Tx/register_citizen" element={<RigisterCitizen_Tax />} />
          <Route  path="/Tx/update_cit" element={<Update_citizens_t />} />

         


      </Routes> 
    </div>
  );
}

export default App;
