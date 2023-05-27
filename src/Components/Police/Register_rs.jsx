
import React, { useState } from "react";
import axios from "axios"
import { useForm } from "react-hook-form";
import "../Employer/styles_Form.css";
import PNavbar from "./PNavbar";

function Register_rs_pl() {
    const [stute, setStute] = useState(true);
    const { register, handleSubmit, errors, reset } = useForm();
    const handleRegistration =async (data) => {
      data.status='true'
      const res = await axios.post("http://localhost:4000/policeRS", data, {
        maxBodyLength: "Infinity",
      });
      reset()
    }
  return (
    <div>
         <div>
        <PNavbar/>
    <div className="flex items-center justify-center bg-green  px-3 py-6">
    <form className="form-width mt-5 p-4 bg-slate-200 form_box4" onSubmit={handleSubmit(handleRegistration)} >
        <div><h1 className="text-3xl font-bold text-gray-700 p-3"> Register RS</h1></div>
        <div className="flex justify-around items-center font-bold mt-2">
        <label className="w-1/4">ID</label>
        <input className="leading-8 outline-none p-1 pl-2 border-color" name="From" {...register('ID')} />
      </div>
    <div className="flex justify-around items-center font-bold mt-2">
        <label className="w-1/4">From</label>
        <input className="leading-8 outline-none p-1 pl-2 border-color" name="From" {...register('From')} />
      </div>
      <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">CertificatId</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="certificatId" {...register('certificatId')} />
    </div>
      <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">Year of first use</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Year of first use" {...register('Year of first use')} />
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">Vin</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="age" {...register('vin')} />
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">Model</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Model" {...register('Model')} />
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">Brand</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Brand" {...register('Brand')} />
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">Type</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Type" {...register('Type')} />
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">Body</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Body" {...register('Body')} />
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">Energy</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Energy" {...register('Energy')} />
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">Power</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Power" {...register('Power')} />
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">Number of places</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Number_of_places" {...register('Number_of_places')} />
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">D.O.R Card</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Date_of_Register_Card" {...register('Date_of_Register_Card')} />
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">City</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="City" {...register('City')} />
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">vrp</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="vrp" {...register('vrp')} />
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">Owner First Name</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Owner_First_Name" {...register('Owner_First_Name')} />
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">Owner Second Name</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Owner_Second_Name" {...register('Owner_Second_Name')} />
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">Birth Day</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Birth_Day" {...register('Birth_Day')} />
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">Birth Place</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Birth_Place" {...register('Birth_Place')} />
    </div>
    <div className="flex justify-around items-center font-bold mt-2">
      <label className="w-1/4">Address</label>
      <input className="leading-8 outline-none p-1 pl-2 border-color" name="Address" {...register('Address')} />
    </div>
      <button className="font-bold text-lg mt-5 p-4 bg-gray-900 text-slate-200 w-60 rounded-full border-solid"  >register</button>
    </form>
    </div>
    </div>
    </div>
  )
}

export default Register_rs_pl