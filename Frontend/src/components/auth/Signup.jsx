import React from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import axios from "axios";

const Signup = () => {
  const [input,setInput]= useState(
    {
      fullname:"",
      email:"",
      phoneNumber:"",
      password:"",
      role:"",
      file:""

    } );
    const navigate = useNavigate();


    const changeEventHandler = (e)=>{
      setInput({...input,[e.target.name]:e.target.value});
    }
    const changedFileHandler =(e)=>{
      setInput({...input,file:e.target.files?.[0]})
    }

    const submitHandler = async(e)=>{
      e.preventDefault();
      const formData = new FormData();
      formData.append("fullname",input.fullname);
      formData.append("email",input.email);
      formData.append("phoneNumber",input.phoneNumber);
      formData.append("password",input.password);
      formData.append("role",input.data)
      if(input.file){
        formData.append("file",input.file)
      }

     try{
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData,{
       headers:{
        "Content-Type":"multipart/form-data"
       },
       withCredentials:true,
      });
      if(res.data.success){
        navigate("/login");
        toast.success(res.data.message)
      }
     }catch(error){
      console.log(error);
     toast.error(error.response?.data?.message || "Something went wrong");



     }

    }
  return (
    <div>
      <Navbar />

      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <form  onSubmit={submitHandler}className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-semibold mb-6">Sign Up</h1>

          
          <div className="mb-4">
            <Label className="mb-1 block">Full Name</Label>
            <Input type="text" 
            value={input.fullname}
            name="fullname" 
            onChange ={changeEventHandler}
            placeholder="patel" />
          </div>

     
          <div className="mb-4">
            <Label className="mb-1 block">Email</Label>
            <Input type="email" placeholder="aishwarya@gmail.com"
             value={input.email}
            name="email" 
            onChange ={changeEventHandler} />
          </div>

         
          <div className="mb-4">
            <Label className="mb-1 block">Phone Number</Label>
            <Input type="text" placeholder="9876543210" value={input.phoneNumber}
            name="phoneNumber" 
            onChange ={changeEventHandler} />
          </div>

        
          <div className="mb-4">
            <Label className="mb-1 block">Password</Label>
            <Input type="password" placeholder="********" 
             value={input.password}
            name="password" 
            onChange ={changeEventHandler}/>
          </div>

          <div className="flex items-center justify-between ">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input
                type="radio"
                name="role"
                value="student"
                checked={input.role==="student"}
                onChange={changeEventHandler}
                className="cursor-pointer"
                />
                
                <Label htmlFor="r1">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                type="radio"
                name="role"
                value="recruiter" checked={input.role==="recruiter"}
                onChange={changeEventHandler}
                className="cursor-pointer"
                />
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>

            <div className="flex items-center gap-2 px-2">
                <Label>Profile</Label>
               <Input
               accept="image/*"
               type="file"
               onChange = {changedFileHandler}
        
               className="cursor-pointer"/>
            </div>
          </div>
          <Button type="submit" className="w-full my-4" >Signup</Button>
          <span className="text-sm">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
