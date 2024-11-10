import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow text-black">
        <div className="w-1/2 min-h-[45vh] m-auto pt-16 flex flex-col items-center gap-7 ">
          <div className="flex flex-col gap-2">
            <h1 className="text-center text-5xl font-bold">
              Home To Millions Of Shopkeepers
            </h1>
            <p className="text-lg">
              Reduce stockouts, speed up operations, optimize routes and get
              real-time visibility with Odoo's warehouse management app.
            </p>
          </div>
          <Link href={"/login"}>
            <button
              type="button"
              className="text-white w-[200px] bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg px-5 py-2.5 text-center me-2 mb-4 mt-3"
            >
              Start Now
            </button>
          </Link>
        </div>

        <div className="bg-gray-400 h-1 w-full"></div>

        <div className="py-12">
          <div className="flex flex-col gap-6 sm:flex-row justify-evenly">
            <div className="flex flex-col items-center">
              <div className="border rounded-full bg-gray-800 items-center">
                <img
                  className="max-h-36 max-w-36 rounded-full object-cover m-2"
                  src="coin.jpeg"
                  alt=""
                />
              </div>
              <p>Manage Your Finances</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="border rounded-full bg-gray-800 items-center">
                <img
                  className="max-h-36 max-w-36 rounded-full object-cover m-2"
                  src="product1.png"
                  alt=""
                />
              </div>
              <p>Track Your Products</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="border rounded-full bg-gray-800 items-center">
                <img
                  className="max-h-36 max-w-36 rounded-full object-cover m-2 bg-gray-200"
                  src="collab.png"
                  alt=""
                />
              </div>
              <p>Be A Part Of Our Family</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-400 h-1 w-full"></div>

        <div className="py-12 flex justify-center">
          <div className="">
            <iframe className="w-full sm:w-[514px] sm:h-[315px] max-w-[560px] h-full max-h-[314px]"
              // width="560"
              // height="315"
              src="https://www.youtube.com/embed/HE9JioDuXkQ?si=gOLx9ubIPzRwg1pA"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
