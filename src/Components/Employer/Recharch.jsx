import React from 'react'
import { ethers } from "ethers"
import { useForm } from "react-hook-form";
import { useState } from "react";
import contractAddresses from "../../constants/contractAddresses.json";
import abi from "../../constants/abi.json";
import Navbar from './Navbar';
function Search() {
  const { register, handleSubmit, reset } = useForm();
  const [card,setCard]=useState()
  const [toggle,setToggle]=useState(true)
  
  const addressOfContract =contractAddresses[1][0]
  const handleRegistration =async (data) => {
    console.log(data);
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(addressOfContract, abi,signer)
    if(data.status=='1'){
    const mint = await contract.getTemporaryRegisterCertificates(data.id)
    console.log(mint.status[0])
    setCard(mint)
    setToggle(true)
    }else{
      const mint = await contract.getRegisterCertificates(data.id)
    console.log(mint.status[0])
    setCard(mint)
    }
    reset()
  }
  
  return (
    <div className='relative'>
         <Navbar/>
        <div className="flex flex-col items-center justify-center bg-green  px-3 py-6 flex flex-row gap-16">
        <form className="form-width mt-5 p-4 bg-slate-200 form_box1 basis-1/2 items-center " onSubmit={handleSubmit(handleRegistration)} >
            <div><h1 className="text-3xl font-bold text-gray-700 p-3 uppercase"> Search Grey card</h1></div>
            <div className="flex justify-around items-center font-bold mt-2">
            <label className="w-1/4 uppercase text-left">Card Status</label>
            <select defaultValue="2" className="leading-8  outline-none p-1 pr-2 border-color w-52" type="select" name="status" {...register('status')} required>
              <option   value="2">
                PERMANENT
              </option>
              <option value="1">
                TEMPORARY
              </option>
              </select> 
        </div>
        <div className="flex justify-around items-center font-bold mt-2">
            <label className="w-1/4 text-left">ID</label>
            <input className="leading-8 outline-none p-1 pl-2 border-color w-52" name="id" {...register('id')} required/>
        </div>
        
        <button className="font-bold text-lg mt-5 p-4  text-slate-200 w-60 rounded-full border-solid  bg-green-600"   >search</button>
        </form>
        <div className='flex  flex-col justify-center items-center w-full p-2 absolute'>
            {
                card && toggle &&
                 (
                    <div className="flex  flex-col justify-center items-center mb-5 w-8/12 text-left bg-slate-200 p-3 rounded search-back relative"> 
                    <button className='bg-red-500 text-white px-2 py-1 rounded absolute top-1 right-2 font-bold ' onClick={()=>setToggle(!toggle)}>X</button>          
                    <p className=' w-full p-3'> <label className="font-bold " htmlFor="">ID: </label> <span>{((card.registerCertificateId).toNumber())}</span></p>
                <p className=' w-full p-3'><label className="font-bold  " htmlFor="">VIN: </label> <span>{card.vin } </span></p>
                <p className=' w-full p-3'><label className="font-bold  " htmlFor="">VRP: </label> <span>{card.vrp}</span></p>
                <p className=' w-full p-3'><label className="font-bold  " htmlFor="">URI: </label> <span>{card.uri}</span></p>
                {card.newOwner === card.oldOwner ?
                <p className=' w-full p-3'><label className="font-bold" htmlFor="">OWNER: </label> <span>{card.newOwner}</span></p>
                :(<> <p className=' w-full p-3'><label className="font-bold" htmlFor="">OLD OWNER: </label> <span>{card.oldOwner}</span></p>
                  <p className=' w-full p-3'><label className="font-bold" htmlFor="">NEW OWNER: </label> <span>{card.newOwner}</span></p></>
                )}
                <p className=' w-full p-3'><label className="font-bold" htmlFor="">STATE: </label> <span>{card.newState}</span></p>
                <div className=' flex-col text-left w-full p-3'>
                  <label className="font-bold text-left" htmlFor="">SIGNERS:</label>
                <div className='flex items-center justify-evenly'>
                <label  className="font-bold" htmlFor="">STATE:</label><input type="checkbox" checked={card.status[0]===0? false:true} disabled={card.status[0]===0 ? false:true}  />
                <label className="font-bold" htmlFor="">EMPLOYER:</label><input  type="checkbox"  checked={card.status[0]===0? false:true} disabled={card.status[0]===0 ? false:true} />
                <label className="font-bold" htmlFor="">GENDARMERIE:</label><input type="checkbox"  checked={card.status[0]===0? false:true} disabled={card.status[0]===0 ? false:true} />
                <label className="font-bold" htmlFor="">POLICE:</label><input type="checkbox"  checked={card.status[0]===0? false:true} disabled={card.status[0]===0 ? false:true} />
                <label className="font-bold" htmlFor="">TAX:</label><input type="checkbox"  checked={card.status[0]===0? false:true} disabled={card.status[0]===0 ? false:true} />
                </div>
                </div>
                </div>
                )
            }
        </div>
        </div>
      
    </div>
  )
}

export default Search