
import React, { useState } from "react";
import axios from "axios"
import { useForm } from "react-hook-form";
import GNavbar from "./GNavbar";
import police_car from './police_car.jpg'
function Update_citizens_g() {
    const [cit,setCit]=useState()
    const [id,setId]=useState(false)
    const { register, handleSubmit, errors, reset } = useForm();
    const handleRegistration =async (data) => {
      const res = await axios.post("http://localhost:4000/recharch_rs_g", data, {
        maxBodyLength: "Infinity",
      })  .then(function (response) {
        console.log(response.data);
        setCit(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
      reset()
    }
    const handelUpdate= async(id)=>{
      const data={'id':id}
      console.log(data)
      const res = await axios.post("http://localhost:4000/update_rs_g", data, {
        maxBodyLength: "Infinity",
      })  .then(function (response) {
        console.log(response.data);
        setId(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  return (
    <div>
         <GNavbar/>
        <div className="flex items-center justify-center bg-green  px-3 py-6" styles={{ backgroundImage:`url(${police_car})`,backgroundCover:'cover' }}>
        <form className="form-width mt-5 p-4 bg-slate-200 " onSubmit={handleSubmit(handleRegistration)} >
            <div><h1 className="text-3xl font-bold text-gray-700 p-3"> Recharch RS</h1></div>
        <div className="flex justify-around items-center font-bold mt-2">
            <label className="w-1/4">ID</label>
            <input className="leading-8 outline-none p-1 pl-2 border-color" name="id" {...register('id')} />
        </div>
        <div className="flex justify-around items-center font-bold mt-2">
            <label className="w-1/4">VIN</label>
            <input className="leading-8 outline-none p-1 pl-2 border-color" name="vin" {...register('vin')} />
        </div>
        <div className="flex justify-around items-center font-bold mt-2">
            <label className="w-1/4">VRP</label>
            <input className="leading-8 outline-none p-1 pl-2 border-color" name="vrp" {...register('vrp')} />
        </div>
        
        <button className="font-bold text-lg mt-5 p-4 bg-gray-700 text-slate-200 w-60 rounded-full border-solid"  >recharch</button>
        </form>
        </div>
        <div>
            {
                cit?.map(el=>(
                    <div className="flex justify-evenly items-center mb-5" key={el._id}>           
                    <p> <label className="font-bold" htmlFor="">ID: </label> <span>{el.certificatId}</span></p>
                     <p><label className="font-bold" htmlFor="">Full Name: </label> <span>{el.Owner_First_Name } </span><span>{ el.Owner_Second_Name}</span></p>
                      
                     <p><label className="font-bold" htmlFor="">VIN: </label> <span>{el.vin}</span></p>
                     <p><label className="font-bold" htmlFor="">VRP: </label> <span>{el.vrp}</span></p>

                      { ((el.status === 'true') )?(
                      <button className="font-bold text-lg p-2 bg-green-700 text-slate-200 w-60 rounded-full border-solid" style={{display:`${id===el._id?"none":""}`}}  onClick={()=>handelUpdate(el._id)}>Approve</button>
                      ):""}
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default Update_citizens_g