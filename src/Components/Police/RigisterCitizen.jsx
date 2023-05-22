import React, { useState } from "react";
import axios from "axios"
import { useForm } from "react-hook-form";
import "../Employer/styles_Form.css";
import PNavbar from "./PNavbar";

function RigisterCitizen_pl() {
    const [stute, setStute] = useState(true);
    const { register, handleSubmit, errors, reset } = useForm();
    const handleRegistration =async (data) => {
      data.status='true'
      const res = await axios.post("http://localhost:4000/police", data, {
        maxBodyLength: "Infinity",
      });
      reset()
    }
  return (
    <div>
        <PNavbar/>
    <div className="flex items-center justify-center bg-green  px-3 py-6">
    <form className="form-width mt-5 p-4 bg-slate-200 " onSubmit={handleSubmit(handleRegistration)} >
        <div><h1 className="text-3xl font-bold text-gray-700 p-3"> Register Citizen</h1></div>
    <div className="flex justify-around items-center font-bold mt-2">
        <label className="w-1/4">ID</label>
        <input className="leading-8 outline-none p-1 pl-2 border-color" name="ID" {...register('ID')} required/>
      </div>
      <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">First name</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="FirstName" {...register('FirstName')} required/>
    </div>
      <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">Last name</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="SecondName" {...register('SecondName')} required/>
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">age</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Age" {...register('Age')} required/>
    </div>
    
      <button className="font-bold text-lg mt-5 p-4 bg-gray-700 text-slate-200 w-60 rounded-full border-solid"  >register</button>
    </form>
    </div>
    </div>
  )
}

export default RigisterCitizen_pl