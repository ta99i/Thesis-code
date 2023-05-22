import React from 'react'
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import contractAddresses from "../../constants/contractAddresses.json";
import abi from "../../constants/abi.json";
import Navbar from './Navbar';
function Transfer() {
  const [stute, setStute] = useState(true);
  const { register, handleSubmit, errors, reset } = useForm();
const [form,setform]=  useState({id:"",oo:"",no:""})
  const addressOfContract =contractAddresses[1][0]
  const handleRegistration = (data) => {
    console.log(data);
    form.id=data.id
    form.oo=data.oldOwner
    form.no=data.newOwner
    console.log(form)
    reset()
  }
  // const { runContractFunction: transfer,isLoading,isFetching, } = useWeb3Contract({
  //   abi: abi,
  //   contractAddress:addressOfContract,
  //   functionName:"transfer",
  //   params: {certificatId:form.id,oldOwner:form.oo, newOwner:form.no}
  // });
  return (
    <>
    <Navbar/>
    <div className="flex items-center justify-center bg-green  px-3 py-6">
    <form className="form-width mt-5 p-4 bg-slate-200 " onSubmit={handleSubmit(handleRegistration)} >
        <div><h1 className="text-3xl font-bold text-color text-gray-700 p-3">Transfer Grey Cart</h1></div>
    <div className="flex justify-around items-center font-bold mt-2">
        <label className="w-1/4">id</label>
        <input className="leading-8 outline-none p-1 pl-2 border-color" name="id" {...register('id')} required/>
      </div>
      <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">Old Owner</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="oldOwner" {...register('oldOwner')} required/>
    </div>
      <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">New Owner</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="newOwner" {...register('newOwner')} required/>
    </div>
      <button className="font-bold text-lg mt-5 p-4 bg-gray-700 text-slate-200 w-60 rounded-full border-solid"  >{stute?'register':'Wait get hash...'}</button>
    </form>
    </div>
    </>
  )
}

export default Transfer