import React from 'react'
import { ethers } from "ethers"
import { useForm } from "react-hook-form";
import { useState } from "react";
import contractAddresses from "../../constants/contractAddresses.json";
import abi from "../../constants/abi.json";
import Navbar from './Navbar';
function Search() {
  const { register, handleSubmit, reset } = useForm();
  const [cart,setCart]=useState()
  const addressOfContract =contractAddresses[1][0]
  const handleRegistration =async (data) => {
    console.log(data);
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(addressOfContract, abi,signer)
    const mint = await contract.getRegisterCertificates(data.id)
    console.log(mint)
    
    reset()
  }
  
  return (
    <div>
         <Navbar/>
        <div className="flex items-center justify-center bg-green  px-3 py-6">
        <form className="form-width mt-5 p-4 bg-slate-200 form_box5" onSubmit={handleSubmit(handleRegistration)} >
            <div><h1 className="text-3xl font-bold text-gray-700 p-3"> Search Grey Cart</h1></div>
        <div className="flex justify-around items-center font-bold mt-2">
            <label className="w-1/4">ID</label>
            <input className="leading-8 outline-none p-1 pl-2 border-color" name="ID" {...register('id')} required/>
        </div>
        
        <button className="font-bold text-lg mt-5 p-4  text-slate-200 w-60 rounded-full border-solid  bg-green-600"   >search</button>
        </form>
        </div>
        <div>
            {
                cart && (
                    <div className="flex justify-evenly items-center mb-5" key={cart.registerCertificateId}>           
                    <p> <label className="font-bold" htmlFor="">ID: </label> <span>{cart.registerCertificateId}</span></p>
                     <p><label className="font-bold" htmlFor="">VIN: </label> <span>{cart.vin } </span></p>
                     <p><label className="font-bold" htmlFor="">VRP: </label> <span>{cart.vrp}</span></p>
                     <p><label className="font-bold" htmlFor="">URI: </label> <span>{cart.uri}</span></p>
                     <p><label className="font-bold" htmlFor="">OWNER: </label> <span>{cart.owner}</span></p>
                     <p><label className="font-bold" htmlFor="">STATE: </label> <span>{cart.state}</span></p>
                    </div>
                )
            }
        </div>
    </div>
  )
}

export default Search