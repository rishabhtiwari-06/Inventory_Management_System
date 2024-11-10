"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use NextAuth's `signIn` function with 'credentials' provider
    const result = await signIn("credentials", {
      redirect: false, // Prevent automatic redirect
      name: form.name,
      email: form.email,
      password: form.password,
    });

    // Handle the result of the login attempt
    if (result?.ok) {
      router.push("/dashboard");
    } else {
      toast("User Does Not Exist", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        progress={undefined}
        theme="dark"
        transition={Bounce}
      />
      <div className="min-h-[86vh] text-black">
        <div className="w-2/3 flex flex-col justify-center items-center m-auto">
          <h1 className="text-3xl font-bold mt-5 mb-3">
            Login To Your Account
          </h1>
          <form className="pt-2" onSubmit={handleSubmit} action="">
            <div className="flex flex-col gap-1 m-2">
              <label htmlFor="name">Name</label>
              <input
                onChange={handleChange}
                value={form.name || ""}
                className="h-8 w-96 border-2 border-black rounded-lg"
                type="name"
                id="name"
                name="name"
                required
              />
            </div>
            <div className="flex flex-col gap-1 m-2">
              <label htmlFor="email">Email</label>
              <input
                onChange={handleChange}
                value={form.email || ""}
                className="h-8 w-96 border-2 border-black rounded-lg"
                type="email"
                id="email"
                name="email"
                required
              />
            </div>
            <div className="flex flex-col gap-1 m-2">
              <label htmlFor="password">Password</label>
              <input
                onChange={handleChange}
                value={form.password || ""}
                className="h-8 w-96 border-2 border-black rounded-lg"
                type="password"
                id="password"
                name="password"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-3 text-white w-96 ml-2 bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Submit
            </button>
          </form>
          <div className="text-lg text-gray-700 m-4">OR</div>
          <button
            onClick={() => signIn()}
            className="flex items-center w-64 bg-white border border-black rounded-lg shadow-md max-w-xs px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <svg
              className="h-6 w-6 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="-0.5 0 48 48"
              version="1.1"
            >
              <g
                id="Icons"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <g id="Color-" transform="translate(-401.000000, -860.000000)">
                  <g id="Google" transform="translate(401.000000, 860.000000)">
                    <path
                      d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                      id="Fill-1"
                      fill="#FBBC05"
                    >
                      {" "}
                    </path>
                    <path
                      d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                      id="Fill-2"
                      fill="#EB4335"
                    >
                      {" "}
                    </path>
                    <path
                      d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                      id="Fill-3"
                      fill="#34A853"
                    >
                      {" "}
                    </path>
                    <path
                      d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                      id="Fill-4"
                      fill="#4285F4"
                    >
                      {" "}
                    </path>
                  </g>
                </g>
              </g>
            </svg>
            <span>Continue with Google</span>
          </button>
          <div className="text-lg text-gray-400 m-4"></div>
          <div>
            <p>
              <Link href={"/signup"}>
                <span className="cursor-pointer underline text-blue-900">
                  Sign Up
                </span>
              </Link>
              , if you don’t have an account
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page;

