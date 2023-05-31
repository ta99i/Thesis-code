import React from 'react'
import { ethers } from "ethers"
import { useForm } from "react-hook-form";
import contractAddresses from "../../constants/contractAddresses.json";
import abi from "../../constants/abi.json";
import Navbar from './Navbar';

function Transfer() {
  const { register, handleSubmit, reset } = useForm();
  const addressOfContract =contractAddresses[1][0]
  const handleRegistration =async (data) => {
    console.log(data);
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(addressOfContract, abi,signer)
    const mint = await contract.transfer(data.id,data.oldOwner,data.newOwner)
    console.log(mint)
    reset()
  }
  return (
    <>
    <Navbar/>
    <div className="flex items-center justify-center bg-green  px-3 py-6">
    <form className="form-width mt-5 p-4 bg-slate-200 form_box1 " onSubmit={handleSubmit(handleRegistration)} >
        <div><h1 className="text-3xl font-bold text-color text-gray-700 p-3 uppercase">Transfer Grey Cart</h1></div>
    <div className="flex justify-around items-center font-bold mt-2">
        <label className="w-1/4 text-left">ID</label>
        <input className="leading-8 outline-none p-1 pl-2 border-color" name="id" {...register('id')} required/>
      </div>
      <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4 text-left">Old Owner</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="oldOwner" {...register('oldOwner')} required/>
    </div>
      <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4 text-left">New Owner</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="newOwner" {...register('newOwner')} required/>
    </div>
      <button className="font-bold text-lg mt-5 p-4 bg-green-600 text-slate-200 w-60  rounded-full border-solid"  >Transfer</button>
    </form>
    </div>
    </>
  )
}

export default Transfer