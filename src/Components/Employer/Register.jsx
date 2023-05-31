import React, { useState } from "react";
import { ethers } from "ethers"
import { useForm } from "react-hook-form";
import { create } from "ipfs-http-client";
import "./styles_Form.css";
import { useEffect } from "react";
import contractAddresses from "../../constants/contractAddresses.json";
import abi from "../../constants/abi.json";
import Navbar from "./Navbar";

function Register() {
  const [selectedFile, setSelectedFile] = useState([]);
  const [All_hashes, setAll_hashes] = useState();
  const [stute, setStute] = useState(true);
  const addressOfContract =contractAddresses[1][0]
  const { register, handleSubmit, reset } = useForm();
  let hashes=[]
  const ipfs = create("/ip4/127.0.0.1/tcp/5001");
  const handleRegistration = async (data) => {
    data.Hashes=All_hashes
    const res=await ipfs.add(JSON.stringify(data))
    console.log(res)
    const provider =new ethers.providers.Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    const contract = new ethers.Contract(addressOfContract,abi, signer);
     await contract.mintRegisterCertificate(data.States,data.vin,data.vrp,res.path,data.owner).then((response)=>{
      console.log(response)
    }).catch((err)=>console.log(err))
    reset()
  }
  const changeHandler =async  (event) => {
    setSelectedFile([...event.target.files]);
  };
  useEffect(()=>{
    setAll_hashes(All_hashes)
  },[All_hashes])
  useEffect(()=>{
    if(selectedFile.length!==0){
     handleAddFileToIpfss()
    }
  },[selectedFile])
  const handleAddFileToIpfss= async ()=>{
      try{
      setStute(false)
      for await (const result of ipfs.addAll(selectedFile)) {
        hashes.push(result.path)
      }
     setAll_hashes(All_hashes)
      setStute(true)  
  }catch(errors){
    console.log(errors)
  };
  }

  return (
    <>
    <Navbar/>
    <div className="flex items-center justify-center bg-green   px-3 py-6">
    <form className="form-width mt-5 p-4 bg-slate-200 form_box1" onSubmit={handleSubmit(handleRegistration)} >
        <div><h1 className="text-3xl font-bold text-gray-700 p-3"> Register Grey Cart</h1></div>
        <div className="flex justify-around items-center font-bold mt-2">
            <label className="w-1/4 text-left">States</label>
            <input className="leading-8 outline-none p-1 pl-2 border-color" name="States" {...register('States')} required />
        </div>
    <div className="flex justify-around items-center font-bold mt-2">
        <label className="w-1/4 text-left">Vin</label>
        <input className="leading-8 outline-none p-1 pl-2 border-color" name="vin" {...register('vin')} required/>
      </div>
      <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4 text-left">Vrp</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="vrp" {...register('vrp')} required/>
    </div>
      <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4 text-left">Owner</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="owner" {...register('owner')} required/>
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
        <label className="w-1/4 text-left">From</label>
        <input className="leading-8 outline-none p-1 pl-2 border-color" name="From" {...register('From')} required/>
      </div>
   
      <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4 text-left">Year of first use</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Year of first use" {...register('Year of first use')} required/>
    </div>
 
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4 text-left">Model</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Model" {...register('Model')} required/>
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4 text-left">Brand</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Brand" {...register('Brand')} required/>
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4 text-left">Type</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Type" {...register('Type')} required/>
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4 text-left">Body</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Body" {...register('Body')} required/>
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4 text-left">Energy</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Energy" {...register('Energy')} required/>
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4 text-left">Power</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Power" {...register('Power')} required/>
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4 text-left">Number of places</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Number_of_places" {...register('Number_of_places')} required/>
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4 text-left">D.O.R Card</label>
      <input type="date" className="leading-8 outline-none p-1 pl-2 border-color w-52" name="Date_of_Register_Card" {...register('Date_of_Register_Card')} required/>
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4 text-left">City</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="City" {...register('City')} required/>
    </div>
   
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4 text-left">Owner First Name</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Owner_First_Name" {...register('Owner_First_Name')} required/>
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4 text-left">Owner Second Name</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Owner_Second_Name" {...register('Owner_Second_Name')} required/>
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4 text-left">Birth Date</label>
      <input type='date' className="leading-8 outline-none p-1 pl-2 border-color w-52" name="Birth_Day" {...register('Birth_Day')} required/>
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4 text-left">Birth Place</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Birth_Place" {...register('Birth_Place')} required/>
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4 text-left">Address</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Address" {...register('Address')} required/>
    </div>
    <div className="flex items-center justify-center mt-3">
  
  <label className="block">
   <span className="sr-only">Choose files</span>
    <input type="file" onChange={changeHandler} multiple className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100 
     " required/>  
  </label>
    </div>
      <button className="font-bold text-lg mt-5 p-4 bg-green-600 text-slate-200 w-60 rounded-full border-solid"   >{stute ?'register':'Wait get hash...'}</button>
    </form>
    </div>
    </>
  );
}
export default Register;