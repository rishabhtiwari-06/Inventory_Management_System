"use client";
import Navbar from "@/components/Navbar";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const profile = () => {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (session) {
      fetchprofile(session.user.id);
    }
  }, [session, router]);

  const fetchprofile = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/get-user-details?user_id=${userId}`
      ); //Fetching all the items which have user's id
      const data = await response.json();
      console.log(data)
      if (data.length > 0) {
        // Assuming data is an array and has at least one object
        setName(data[0].name);
        setEmail(data[0].email);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  return (
    <>
      <Navbar />
      <div className="w-[60vw]  h-[60vh] m-auto flex justify-center">
        <div className="flex flex-col items-center">
          <h1 className="text-green-600 font-bold text-4xl p-2">Profile</h1>
          <div className="m-4 flex flex-col gap-3">
            <h2 className="text-lg">Name: {name} </h2>
            <div className="text-lg">Email: {email}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default profile;
