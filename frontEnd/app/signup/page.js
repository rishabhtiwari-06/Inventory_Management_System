"use client"
import Navbar from '@/components/Navbar'
import React from 'react'
import Link from 'next/link'
import { useState } from "react";
import { signIn } from 'next-auth/react';
// import { Router } from 'next/router';
import { useRouter } from "next/navigation";

const page = () => {
  const [form, setForm] = useState({})
  const router = useRouter();
  const handleChange = (e)=>{
    setForm({...form, [e.target.name]:e.target.value})
  }
  const handleSubmit = async(e)=>{
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      console.log('Response from backend:', result);
      if (result.status === 'success') {
        // Redirect user after successful login
        console.log(result)
        const signInResult = await signIn('credentials', {
          redirect: false,  // Don't redirect immediately after sign-in
          email: form.email,
          password: form.password,
        }); 
        if (signInResult.ok) {
          // Redirect the user to the dashboard after sign-in
          router.push('/dashboard');
        } else {
          console.error('Sign-in failed:', signInResult.error);
        } // Adjust the route as needed
      }else {
          console.error(result.message); // Handle error (e.g., show error message)
        }
      
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
    setForm({})
  }
  return (
    <>
    <Navbar />
    <div className="min-h-[86vh] text-black ">
        <div className="w-2/3 flex flex-col justify-center items-center m-auto ">
          <h1 className="text-3xl font-bold mt-5 mb-3">Create Your Account</h1>
          <form className="pt-2" onSubmit={handleSubmit} action="">
            <div
              className="flex flex-col
             gap-1 m-2"
            >
              <label htmlFor="name">Name</label>
              <input onChange = {handleChange} value={form.name ? form.name : ""}
                className="h-8 w-96 border-2 border-black rounded-lg"
                type="name"
                id="name"
                name="name"
              />
            </div>
            <div
              className="flex flex-col
             gap-1 m-2"
            >
              <label htmlFor="bussiness">Bussiness Name</label>
              <input onChange={handleChange} value={form.bussiness ? form.bussiness : ""}
                className="h-8 w-96 border-2 border-black rounded-lg"
                type="bussiness"
                id="bussiness"
                name="bussiness"
              />
            </div>
            <div
              className="flex flex-col
             gap-1 m-2"
            >
              <label htmlFor="category">Bussiness Category</label>
              <input onChange={handleChange} value={form.category ? form.category : ""} 
                className="h-8 w-96 border-2 border-black rounded-lg"
                type="category"
                id="category"
                name="category"
              />
            </div>
            <div
              className="flex flex-col
             gap-1 m-2"
            >
              <label htmlFor="email">Email</label>
              <input onChange={handleChange} value={form.email ? form.email : ""}
                className="h-8 w-96 border-2 border-black rounded-lg"
                type="email"
                id="email"
                name="email"
              />
            </div>
            <div
              className="flex flex-col
             gap-1 m-2"
            >
              <label htmlFor="password">Create Password</label>
              <input onChange={handleChange} value={form.password ? form.password : ""}
                className="h-8 w-96 border-2 border-black rounded-lg"
                type="password"
                id="password"
                name="password"
              />
            </div>
          
            <button
              type="submit"
              className="mt-3 text-white w-96 ml-2 bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
            Sign Up
            </button>
          </form>
          

         
        </div>
      </div>
    </>
  )
}

export default page