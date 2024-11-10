"use client";
import React from "react";
import { useState , useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { getSession } from "next-auth/react";

const addproduct = () => {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({});
  const router = useRouter();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!session || !session.user) {
      router.push("/dashboard");
    }
  }, [session, router]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/edit-product',{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      });
      const result = await res.json()
      if (result.success) {
         console.log("YYAAAAAAAAAAAAY")
      }
      console.log(result)
      if (!res.ok) {
        const error = await res.text(); // Try to get the error message
        throw new Error(`Error: ${error}`);
      }
      
    } catch (error) {
      console.log(error);
    }
    setForm("");
  };
  return (
    <>
      <div className="min-h-screen bg-gray-50 text-black ">
        <div className="w-2/3 flex flex-col justify-center items-center m-auto ">
          <h1 className="text-3xl font-bold mt-5 mb-3">Add The Product</h1>
          {userId && <p>Your User ID: {userId}</p>}
          {/* {userId && <p>Your User ID: {userId}</p>} */}
          {/* <p>Your User ID: {user_id}</p> */}
          <form className="p-4 border bg-gray-200 m-2 rounded-xl" onSubmit={handleSubmit} action="submit">
            <div
              className="flex flex-col
             gap-1 m-2"
            >
              <label htmlFor="user_id">User Id</label>
              <input
                onChange={handleChange}
                value={form.user_id ? form.user_id : ""}
                className="h-8 px-2 w-96 border-2 border-black rounded-lg"
                type="user_id"
                id="user_id"
                name="user_id"
              />
            </div>
            <div
              className="flex flex-col
             gap-1 m-2"
            >
              <label htmlFor="item_name">Name Of Product</label>
              <input
                onChange={handleChange}
                value={form.item_name ? form.item_name : ""}
                className="h-8 w-96 border-2 border-black rounded-lg px-2"
                type="item_name"
                id="item_name"
                name="item_name"
              />
            </div>
            <div
              className="flex flex-col
             gap-1 m-2"
            >
              <label htmlFor="category">Category Of Product</label>
              <input
                onChange={handleChange}
                value={form.category ? form.category : ""}
                className="h-8 w-96 border-2 border-black px-2 rounded-lg"
                type="category"
                id="category"
                name="category"
              />
            </div>
            <div
              className="flex flex-col
             gap-1 m-2"
            >
              <label htmlFor="price">Selling Price</label>
              <input
                onChange={handleChange}
                value={form.price ? form.price : ""}
                className="h-8 w-96 px-2 border-2 border-black rounded-lg"
                type="price"
                id="price"
                name="price"
              />
            </div>
            <div
              className="flex flex-col
             gap-1 m-2"
            >
              <label htmlFor="quantity">Quantity</label>
              <input
                onChange={handleChange}
                value={form.quantity ? form.quantity : ""}
                className="h-8 px-2 w-96 border-2 border-black rounded-lg"
                type="quantity"
                id="quantity"
                name="quantity"
              />
            </div>
            <button type="submit" className="text-white w-96 mt-3 ml-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default addproduct;
